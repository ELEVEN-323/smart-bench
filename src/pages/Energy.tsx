import { useEffect, useState, type CSSProperties } from 'react'
import { getEnvironment, type EnvData } from '../services/weather'
import './energy.css'

type Crowd = 'sparse' | 'normal' | 'peak'

const CROWDS: { key: Crowd; label: string; boost: number }[] = [
  { key: 'sparse', label: '人流稀疏', boost: 0 },
  { key: 'normal', label: '人流正常', boost: 10 },
  { key: 'peak', label: '人流高峰', boost: 20 },
]

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

export default function Energy() {
  const [env, setEnv] = useState<EnvData | null>(null)
  const [light, setLight] = useState(500)
  const [crowd, setCrowd] = useState<Crowd>('normal')

  const refresh = () => {
    setEnv(null)
    getEnvironment().then(setEnv)
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (env) setLight(Math.round(env.light))
  }, [env])

  // 自适应调光：光照越暗越亮；人流量越大越亮
  const base = clamp(100 - light / 12, 15, 100)
  const boost = CROWDS.find((c) => c.key === crowd)?.boost ?? 0
  const brightness = Math.round(clamp(base + boost, 15, 100))
  const watt = Math.round(28 + brightness * 0.4)

  const envCards: { icon: string; label: string; value: string }[] = [
    { icon: '🌡️', label: '温度', value: env ? `${env.temperature} ℃` : '—' },
    { icon: '💧', label: '湿度', value: env ? `${env.humidity} %` : '—' },
    { icon: '😷', label: 'PM2.5', value: env ? `${env.pm25}` : '—' },
    { icon: '🔊', label: '噪声', value: env ? `${env.noise} dB` : '—' },
    { icon: '☀️', label: '光照', value: env ? `${env.light} lx` : '—' },
  ]

  return (
    <div className="energy">
      <div className="page-head">
        <h2>💡 照明能源</h2>
        <p className="page-sub">
          光照与人流自适应调光 · 太阳能储能优化
          <span className="page-note">（温湿度/PM2.5 来自 Open-Meteo，失败自动降级 Mock）</span>
        </p>
      </div>

      <div className="energy-grid">
        <section className="panel env-panel">
          <div className="panel-title-row">
            <h3 className="panel-title">🌍 环境监测</h3>
            <button className="mini-btn" onClick={refresh}>
              {env ? `更新于 ${env.updatedAt} · 刷新` : '加载中…'}
            </button>
          </div>
          <div className="env-cards">
            {envCards.map((c) => (
              <div key={c.label} className="env-card">
                <span className="env-icon">{c.icon}</span>
                <span className="env-value">{c.value}</span>
                <span className="env-label">{c.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel dim-panel">
          <h3 className="panel-title">🎚️ 自适应调光模拟</h3>

          <div className="dim-lamp-wrap">
            <div className="dim-lamp" style={{ '--glow': `${brightness / 100}` } as CSSProperties}>
              <div className="dim-lamp-head" />
              <div className="dim-lamp-pole" />
              <div className="dim-lamp-glow" />
            </div>
            <div className="dim-readout">
              <div className="dim-big">{brightness}%</div>
              <div className="dim-sub">当前亮度</div>
              <div className="dim-sub">灯头功率 {watt} W</div>
            </div>
          </div>

          <label className="dim-slider-label">
            环境光照：<b>{light} lx</b>（{light < 200 ? '夜晚' : light < 500 ? '阴天/傍晚' : '白天'}）
            <input
              type="range"
              min={0}
              max={1000}
              step={10}
              value={light}
              onChange={(e) => setLight(Number(e.target.value))}
              className="dim-slider"
            />
          </label>

          <div className="dim-crowd">
            <span className="dim-slider-label">人流量：</span>
            {CROWDS.map((c) => (
              <button key={c.key} className={`chip ${crowd === c.key ? 'on' : ''}`} onClick={() => setCrowd(c.key)}>
                {c.label}
              </button>
            ))}
          </div>

          <p className="dim-note">
            规则：环境越暗、人流越多，亮度自动升高（{base.toFixed(0)}% + 人流加成 {boost}%）。演示用滑块模拟光照变化。
          </p>
        </section>

        <section className="panel flow-panel">
          <h3 className="panel-title">🔋 能源流向</h3>
          <div className="flow">
            <div className="flow-node">
              <span className="flow-icon">🌞</span>
              <b>太阳能板</b>
              <small>当日发电 2.4 kWh</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-node">
              <span className="flow-icon">🔋</span>
              <b>储能电池</b>
              <small>电量 68%</small>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-node">
              <span className="flow-icon">💡</span>
              <b>LED 灯头</b>
              <small>{watt} W · 自适应</small>
            </div>
          </div>
          <ul className="flow-notes">
            <li>白天光伏优先供电，余电储能；夜间储能 + 市电互补</li>
            <li>低位照明常亮，主灯按人流与光照自动调功</li>
            <li>预计年节电约 40%（估算，供演示说明）</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
