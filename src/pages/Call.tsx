import { useEffect, useRef, useState } from 'react'
import { PhoneCall, PhoneOff, User, Video } from 'lucide-react'
import './call.css'

/**
 * 视频通话：PeerJS（WebRTC）点对点，按房间号配对双终端，无需自建信令服务器。
 * 演示：两台设备（或两个浏览器窗口）输入同一房间号，一端「呼叫」、另一端「等待接听」。
 */

type Phase = 'idle' | 'calling' | 'ringing' | 'connected'

function fmt(sec: number): string {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
}

function loadPeerJS(): Promise<any> {
  const w = window as any
  if (w.Peer) return Promise.resolve(w.Peer)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js'
    s.async = true
    s.onload = () => resolve(w.Peer)
    s.onerror = () => reject(new Error('PeerJS 加载失败（请检查网络）'))
    document.head.appendChild(s)
  })
}

export default function Call() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [room, setRoom] = useState('')
  const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [hasLocal, setHasLocal] = useState(false)
  const [remoteOn, setRemoteOn] = useState(false)

  const peerRef = useRef<any>(null)
  const callRef = useRef<any>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setRoom(String(Math.floor(1000 + Math.random() * 9000)))
    return () => cleanup()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  function cleanup() {
    try {
      callRef.current?.close()
    } catch {
      /* noop */
    }
    callRef.current = null
    try {
      peerRef.current?.destroy()
    } catch {
      /* noop */
    }
    peerRef.current = null
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    setRemoteOn(false)
    setHasLocal(false)
  }

  function hangup() {
    cleanup()
    setPhase('idle')
    setElapsed(0)
  }

  async function getMedia(): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('此浏览器不支持摄像头/麦克风')
    return navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  }

  function peerRoomId(): string {
    return `smart-bench-${room}`
  }

  function wireCall(call: any) {
    call.on('stream', (remote: MediaStream) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remote
      setRemoteOn(true)
      setPhase('connected')
      setElapsed(0)
    })
    call.on('close', () => hangup())
    call.on('error', (err: any) => {
      setError(`通话异常：${err?.message || '连接中断'}`)
      hangup()
    })
  }

  async function startCall() {
    setError('')
    setPhase('calling')
    try {
      const Peer = await loadPeerJS()
      const stream = await getMedia()
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      setHasLocal(true)

      const peer = new Peer()
      peerRef.current = peer
      peer.on('open', () => {
        const call = peer.call(peerRoomId(), stream)
        callRef.current = call
        wireCall(call)
      })
      peer.on('error', (err: any) => {
        const type = err?.type
        if (type === 'peer-unavailable') setError('对方不在线：请让对方先点「等待接听」，房间号要一致')
        else setError(`呼叫失败：${type || err?.message || '未知错误'}`)
        cleanup()
        setPhase('idle')
      })
    } catch (e: any) {
      setError(e?.message || String(e))
      setPhase('idle')
    }
  }

  async function startAnswer() {
    setError('')
    setPhase('ringing')
    try {
      const Peer = await loadPeerJS()
      const stream = await getMedia()
      localStreamRef.current = stream
      if (localVideoRef.current) localVideoRef.current.srcObject = stream
      setHasLocal(true)

      const peer = new Peer(peerRoomId())
      peerRef.current = peer
      peer.on('call', (call: any) => {
        call.answer(stream)
        callRef.current = call
        wireCall(call)
      })
      peer.on('error', (err: any) => {
        const type = err?.type
        if (type === 'unavailable-id') setError('该房间号已被占用，请换一个')
        else setError(`接听失败：${type || err?.message || '未知错误'}`)
        cleanup()
        setPhase('idle')
      })
    } catch (e: any) {
      setError(e?.message || String(e))
      setPhase('idle')
    }
  }

  const busy = phase !== 'idle'

  return (
    <div className="call">
      <div className="page-head">
        <span className="page-kicker">亲情连接</span>
        <h2>视频通话</h2>
        <p className="page-sub">
          与家人面对面，随叫随到
          <span className="page-note">（PeerJS · WebRTC 点对点，已接入真实通话）</span>
        </p>
      </div>

      <div className="call-layout">
        <section className="panel call-stage">
          <div className={`call-screen ${phase === 'connected' ? 'live' : ''}`}>
            {remoteOn && <video ref={remoteVideoRef} className="video-remote" autoPlay playsInline />}

            {!remoteOn && (
              <div className="call-idle">
                <span className={`call-avatar ${phase === 'calling' || phase === 'ringing' ? 'ringing' : ''}`}>
                  <User size={72} strokeWidth={1.5} />
                </span>
                <p className="call-hint">
                  {phase === 'idle' && '输入房间号，呼叫或等待家人'}
                  {phase === 'calling' && '正在呼叫家人…'}
                  {phase === 'ringing' && '等待家人呼叫…'}
                </p>
              </div>
            )}

            {hasLocal && <video ref={localVideoRef} className="video-local" autoPlay muted playsInline />}
          </div>

          {phase === 'connected' && <p className="call-status">已接通 · {fmt(elapsed)}</p>}
          {error && <p className="call-error">{error}</p>}

          <div className="call-actions">
            {phase === 'idle' && (
              <>
                <button className="call-btn call-start" onClick={startCall} disabled={!room}>
                  <PhoneCall size={20} />
                  呼叫家人
                </button>
                <button className="call-btn call-answer" onClick={startAnswer} disabled={!room}>
                  <Video size={20} />
                  等待接听
                </button>
              </>
            )}
            {(phase === 'calling' || phase === 'ringing') && (
              <button className="call-btn call-end" onClick={hangup}>
                <PhoneOff size={20} />
                {phase === 'calling' ? '取消呼叫' : '取消等待'}
              </button>
            )}
            {phase === 'connected' && (
              <button className="call-btn call-end" onClick={hangup}>
                <PhoneOff size={20} />
                挂断
              </button>
            )}
          </div>
        </section>

        <aside className="call-side">
          <div className="panel">
            <h3 className="panel-title">通话房间号</h3>
            <input
              className="call-room-input"
              value={room}
              onChange={(e) => setRoom(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="4 位数字房间号"
              disabled={busy}
            />
            <p className="call-room-note">
              两台设备输入相同房间号：先在一端点「等待接听」，再在另一端点「呼叫家人」，即可视频通话。
            </p>
          </div>
          <div className="panel">
            <h3 className="panel-title">为什么用房间号</h3>
            <ul className="call-notes">
              <li>无需账号与好友关系，输入房间号即通</li>
              <li>点对点加密，视频不经服务器中转</li>
              <li>SOS 触发后自动预建房间，家人一键加入</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
