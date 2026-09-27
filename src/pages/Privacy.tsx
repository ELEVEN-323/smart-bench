import { useState } from 'react'
import { HeartPulse, PersonStanding, MapPin, Users } from 'lucide-react'
import { Switch } from 'antd'
import './privacy.css'

const ITEMS = [
  { key: 'heart', icon: HeartPulse, name: '非接触心率 / 呼吸监测', desc: '仅用于健康预警，数据不出社区平台' },
  { key: 'fall', icon: PersonStanding, name: '跌倒检测与久坐提醒', desc: '异常时自动呼叫，并向家属推送' },
  { key: 'location', icon: MapPin, name: '位置信息共享', desc: '仅限紧急求助时使用' },
  { key: 'family', icon: Users, name: '健康档案共享给家属', desc: '家属可查看周报与预警记录' },
]

const FLOW = [
  { label: '座椅感知', sub: '雷达 / 视觉' },
  { label: '本地边缘处理', sub: '原始数据不出设备' },
  { label: '加密上传', sub: '仅按授权范围' },
  { label: '家属 / 社区 / 医护', sub: '按角色分级可见' },
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
        <span className="page-kicker">数据安全</span>
        <h2>隐私授权</h2>
        <p className="page-sub">
          我的健康数据，我做主
          <span className="page-note">（授权页原型：模拟合规交互与数据流向）</span>
        </p>
      </div>

      <div className="privacy-layout">
        <section className="panel">
          <h3 className="panel-title">数据流向</h3>
          <ol className="privacy-flow">
            {FLOW.map((f, i) => (
              <li className="privacy-node" key={f.label}>
                <span className="privacy-node-num">{String(i + 1).padStart(2, '0')}</span>
                <b>{f.label}</b>
                <small>{f.sub}</small>
              </li>
            ))}
          </ol>
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
                  <span className="grant-icon">
                    <item.icon size={22} />
                  </span>
                  <div>
                    <b className="grant-name">{item.name}</b>
                    <p className="grant-desc">{item.desc}</p>
                  </div>
                </div>
                <Switch checked={grants[item.key]} onChange={() => toggle(item.key)} title={item.name} />
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
