import { useEffect, useState } from 'react'
import { speak, stopSpeaking } from '../services/tts'
import './sos.css'

/**
 * 紧急呼叫状态机（演示为流程模拟，真实通话需接入通信服务）：
 * 待机 → 按下SOS → 呼叫中 → 已接通 → 语音安抚 → 结束
 *                 ↘ 3 秒无人接听 → 自动升级（模拟拨打 120 + 位置推送）
 */

type Phase = 'idle' | 'calling' | 'connected' | 'comforting' | 'escalated' | 'ended'

const FLOW = [
  { key: 'idle', label: '待机' },
  { key: 'calling', label: '呼叫中' },
  { key: 'connected', label: '已接通' },
  { key: 'comforting', label: '语音安抚' },
  { key: 'ended', label: '结束' },
] as const

const PHASE_TEXT: Record<Phase, { title: string; desc: string }> = {
  idle: { title: '随时待命', desc: '按下红色按钮，一键连接社区服务中心与您的家人。' },
  calling: { title: '正在呼叫…', desc: '已同时呼叫社区服务中心与紧急联系人，请稍候。' },
  connected: { title: '呼叫已接通', desc: '社区值班人员已应答，正在确认您的情况。' },
  comforting: { title: '语音安抚中', desc: '请您保持冷静、原地休息，救援人员正在赶来。' },
  escalated: { title: '已自动升级', desc: '呼叫未接通，系统已自动拨打 120，并向社区值班室推送您的位置。' },
  ended: { title: '本次呼叫结束', desc: '救援已安排，请安心等候，可随时再次按下按钮呼救。' },
}

function fmt(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, '0')
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function Sos() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)

  const press = () => {
    if (phase !== 'idle') return
    setPhase('calling')
    speak('正在为您呼叫社区服务中心与您的紧急联系人，请稍候。')
  }

  // 状态机推进
  useEffect(() => {
    if (phase === 'calling') {
      const t = setTimeout(() => {
        setPhase('connected')
        speak('您好，这里是春晖社区服务中心，我们已收到您的求助，请不要着急。')
      }, 3000)
      return () => clearTimeout(t)
    }
    if (phase === 'connected') {
      const t = setTimeout(() => {
        setPhase('comforting')
        speak('请您保持冷静，原地休息。社区工作人员和您的家人正在赶来，预计五分钟内到达，我会一直陪着您。')
      }, 1800)
      return () => clearTimeout(t)
    }
  }, [phase])

  // 通话计时
  useEffect(() => {
    if (phase !== 'calling' && phase !== 'connected' && phase !== 'comforting' && phase !== 'escalated') return
    const t = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const escalate = () => {
    if (phase !== 'calling') return
    setPhase('escalated')
    speak('呼叫未能接通，系统已自动升级：正在拨打 120 急救电话，并已向社区值班室推送您的位置信息。')
  }

  const end = () => {
    stopSpeaking()
    setPhase('ended')
  }

  const reset = () => {
    stopSpeaking()
    setElapsed(0)
    setPhase('idle')
  }

  const activeStep = phase === 'escalated' ? 1 : FLOW.findIndex((s) => s.key === phase)

  return (
    <div className="sos">
      <div className="page-head">
        <h2>🆘 紧急呼叫</h2>
        <p className="page-sub">
          一键连接社区与家人 · 语音安抚全程陪伴
          <span className="page-note">（本页为流程模拟，真实通话将接入 WebRTC）</span>
        </p>
      </div>

      <div className="sos-layout">
        <section className="panel sos-stage">
          <button
            className={`sos-btn ${phase === 'calling' ? 'calling' : ''} ${phase === 'connected' || phase === 'comforting' ? 'connected' : ''} ${phase === 'escalated' ? 'escalated' : ''} ${phase === 'ended' ? 'ended' : ''}`}
            onClick={press}
            disabled={phase !== 'idle'}
          >
            {phase === 'idle' && 'SOS\n紧急呼叫'}
            {phase === 'calling' && '呼叫中…'}
            {phase === 'connected' && '已接通'}
            {phase === 'comforting' && '安抚中'}
            {phase === 'escalated' && '已拨打 120'}
            {phase === 'ended' && '呼叫已结束'}
          </button>

          {phase === 'calling' && (
            <button className="sos-sub-btn" onClick={escalate}>
              ⚠️ 演示：3 秒无人接听 → 自动升级
            </button>
          )}
          {phase === 'comforting' && (
            <button className="sos-sub-btn" onClick={end}>
              📞 结束通话
            </button>
          )}
          {phase === 'ended' && (
            <button className="sos-sub-btn" onClick={reset}>
              ↺ 重新演示
            </button>
          )}
          {phase === 'escalated' && (
            <button className="sos-sub-btn" onClick={reset}>
              ↺ 重新演示
            </button>
          )}
        </section>

        <aside className="sos-side">
          <div className="panel">
            <h3 className="panel-title">当前状态</h3>
            <p className="sos-state-title">{PHASE_TEXT[phase].title}</p>
            <p className="sos-state-desc">{PHASE_TEXT[phase].desc}</p>
            {elapsed > 0 && phase !== 'ended' && <p className="sos-elapsed">⏱ 本次呼叫时长 {fmt(elapsed)}</p>}
          </div>

          <div className="panel">
            <h3 className="panel-title">呼叫流程</h3>
            <ol className="sos-flow">
              {FLOW.map((s, i) => (
                <li key={s.key} className={`sos-flow-step ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}>
                  <span className="sos-flow-dot" />
                  <span className="sos-flow-label">{s.label}</span>
                  {phase === 'escalated' && s.key === 'calling' && <span className="sos-flow-badge">已自动升级</span>}
                </li>
              ))}
            </ol>
          </div>

          <div className="panel">
            <h3 className="panel-title">安全保障</h3>
            <ul className="sos-list">
              <li>SOS 通道独立供电，断网断电仍可用</li>
              <li>多模态交叉验证，降低误报</li>
              <li>位置信息随呼叫自动推送</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
