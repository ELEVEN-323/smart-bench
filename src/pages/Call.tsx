import { useEffect, useState } from 'react'
import './call.css'

/**
 * 视频通话（演示为模拟流程）。
 * 真实接入规划：PeerJS（WebRTC），按房间号配对双终端，无需自建信令服务器。
 */

type Phase = 'idle' | 'calling' | 'connected'

function fmt(sec: number): string {
  return `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
}

export default function Call() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [room, setRoom] = useState('')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setRoom(`ROOM-${Math.floor(1000 + Math.random() * 9000)}`)
  }, [])

  useEffect(() => {
    if (phase === 'calling') {
      const t = setTimeout(() => setPhase('connected'), 1600)
      return () => clearTimeout(t)
    }
    if (phase === 'connected') {
      const t = setInterval(() => setElapsed((e) => e + 1), 1000)
      return () => clearInterval(t)
    }
  }, [phase])

  const hangup = () => {
    setPhase('idle')
    setElapsed(0)
  }

  return (
    <div className="call">
      <div className="page-head">
        <h2>📹 视频通话</h2>
        <p className="page-sub">
          与家人面对面，随叫随到
          <span className="page-note">（演示为模拟流程，真实通话将接入 PeerJS / WebRTC）</span>
        </p>
      </div>

      <div className="call-layout">
        <section className="panel call-stage">
          <div className={`call-screen ${phase === 'connected' ? 'live' : ''}`}>
            {phase === 'idle' && (
              <div className="call-idle">
                <span className="call-avatar">👵</span>
                <p className="call-hint">点击下方按钮，呼叫家人</p>
              </div>
            )}
            {phase === 'calling' && (
              <div className="call-idle">
                <span className="call-avatar ringing">👵</span>
                <p className="call-hint">正在呼叫家人…</p>
              </div>
            )}
            {phase === 'connected' && (
              <div className="call-idle">
                <span className="call-avatar">👵</span>
                <p className="call-hint">已接通 · {fmt(elapsed)}</p>
              </div>
            )}
          </div>

          <div className="call-actions">
            {phase === 'idle' && (
              <button className="call-btn call-start" onClick={() => setPhase('calling')}>
                📞 呼叫家人
              </button>
            )}
            {phase === 'calling' && (
              <button className="call-btn call-end" onClick={hangup}>
                ✖ 取消呼叫
              </button>
            )}
            {phase === 'connected' && (
              <button className="call-btn call-end" onClick={hangup}>
                ✖ 挂断
              </button>
            )}
          </div>
        </section>

        <aside className="call-side">
          <div className="panel">
            <h3 className="panel-title">通话房间号</h3>
            <p className="call-room">{room}</p>
            <p className="call-room-note">家人输入相同房间号即可连接（真实接入后生效）。</p>
          </div>
          <div className="panel">
            <h3 className="panel-title">为什么用房间号</h3>
            <ul className="call-notes">
              <li>无需账号与好友关系，输入 4 位数字即通</li>
              <li>通话点对点加密，不经过服务器中转</li>
              <li>SOS 触发后自动预建房间，家人一键加入</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
