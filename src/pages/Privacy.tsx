import { useState } from 'react'
import './privacy.css'

const ITEMS = [
  { key: 'heart', icon: '❤️', name: '非接触心率 / 呼吸监测', desc: '仅用于健康预警，数据不出社区平台' },
  { key: 'fall', icon: '🛟', name: '跌倒检测与久坐提醒', desc: '异常时自动呼叫，并向家属推送' },
  { key: 'location', icon: '📍', name: '位置信息共享', desc: '仅限紧急求助时使用' },
  { key: 'family', icon: '👨‍👩‍👧', name: '健康档案共享给家属', desc: '家属可查看周报与预警记录' },
]

const FLOW = [
  { icon: '🪑', label: '座椅感知', sub: '雷达 / 视觉' },
  { icon: '⚙️', label: '本地边缘处理', sub: '原始数据不出设备' },
  { icon: '🔒', label: '加密上传', sub: '仅按授权范围' },
  { icon: '🏥', label: '家属 / 社区 / 医护', sub: '按角色分级可见' },
]

export default function Privacy() {
  const [grants, setGrants] = useState<Record<string, boolean>>({
    heart: true,
    fall: true,
    location: false,
    family: false,
  })
  const [saved, setSaved] = useState(false)

  const toggle = (key: string) => {
    setGrants((g) => ({ ...g, [key]: !g[key] }))
    setSaved(false)
  }

  return (
    <div className="privacy">
      <div className="page-head">
        <h2>🔐 隐私授权</h2>
        <p className="page-sub">
          我的健康数据，我做主
          <span className="page-note">（授权页原型：模拟合规交互与数据流向）</span>
        </p>
      </div>

      <div className="privacy-layout">
        <section className="panel">
          <h3 className="panel-title">数据流向</h3>
          <div className="privacy-flow">
            {FLOW.map((f, i) => (
              <div className="privacy-flow-wrap" key={f.label}>
                <div className="privacy-node">
                  <span className="privacy-node-icon">{f.icon}</span>
                  <b>{f.label}</b>
                  <small>{f.sub}</small>
                </div>
                {i < FLOW.length - 1 && <span className="privacy-arrow">→</span>}
              </div>
            ))}
          </div>
          <p className="privacy-note">
            设计原则：本地优先处理，原始数据不出设备；上传仅按您授权的范围与对象，随时可撤回。
          </p>
        </section>

        <section className="panel">
          <h3 className="panel-title">授权设置</h3>
          <ul className="grant-list">
            {ITEMS.map((item) => (
              <li key={item.key} className="grant-item">
                <div className="grant-info">
                  <span className="grant-icon">{item.icon}</span>
                  <div>
                    <b className="grant-name">{item.name}</b>
                    <p className="grant-desc">{item.desc}</p>
                  </div>
                </div>
                <button
                  className={`switch ${grants[item.key] ? 'on' : ''}`}
                  onClick={() => toggle(item.key)}
                  role="switch"
                  aria-checked={grants[item.key]}
                  aria-label={item.name}
                >
                  <span className="switch-knob" />
                </button>
              </li>
            ))}
          </ul>
          <div className="grant-actions">
            <button className="btn-primary-inline" onClick={() => setSaved(true)}>
              保存授权
            </button>
            {saved && <span className="saved-hint">✓ 已保存（可随时在此撤回）</span>}
          </div>
        </section>
      </div>
    </div>
  )
}
