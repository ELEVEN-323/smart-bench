import { useEffect, useState } from 'react'
import {
  Sun,
  BatteryCharging,
  Gauge,
  Zap,
  Thermometer,
  Droplets,
  Wind,
  Volume2,
  SunDim,
  PanelTop,
  Battery,
  Lightbulb,
} from 'lucide-react'
import { getEnvironment, type EnvData } from '../services/weather'
import CountUp from '../components/CountUp'
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

  // 自适应调光：环境越暗越亮；人流量越大越亮
  const base = clamp(100 - light / 12, 15, 100)
  const boost = CROWDS.find((c) => c.key === crowd)?.boost ?? 0
  const brightness = Math.round(clamp(base + boost, 15, 100))
  const watt = Math.round(28 + brightness * 0.4)

  const metrics = [
    { icon: Sun, label: '今日发电量', value: 2.4, unit: 'kWh', decimals: 1 },
    { icon: BatteryCharging, label: '储能电量', value: 68, unit: '%', decimals: 0 },
    { icon: Gauge, label: '当前亮度', value: brightness, unit: '%', decimals: 0 },
    { icon: Zap, label: '灯头功率', value: watt, unit: 'W', decimals: 0 },
  ]

  const envItems = [
    { icon: Thermometer, label: '温度', value: env?.temperature, unit: '℃', decimals: 1 },
    { icon: Droplets, label: '湿度', value: env?.humidity, unit: '%', decimals: 0 },
    { icon: Wind, label: 'PM2.5', value: env?.pm25, unit: ' μg/m³', decimals: 0 },
    { icon: Volume2, label: '噪声', value: env?.noise, unit: ' dB', decimals: 0 },
    { icon: SunDim, label: '光照', value: env?.light, unit: ' lx', decimals: 0 },
  ]

  const flowNodes = [
    { icon: PanelTop, name: '太阳能板', note: '当日发电 2.4 kWh' },
    { icon: Battery, name: '储能电池', note: '电量 68%' },
    { icon: Lightbulb, name: 'LED 灯头', note: `${watt} W · 自适应` },
  ]

  return (
    <div className="energy">
      <div className="page-head">
        <span className="page-kicker">绿色能源</span>
        <h2>照明能源</h2>
        <p className="page-sub">
          太阳能 · 储能 · 自适应调光，实时看板（环境数据来自 Open-Meteo，失败自动降级 Mock）
          <button className="energy-badge" onClick={refresh}>
            {env ? `更新于 ${env.updatedAt}` : '加载中…'}
          </button>
        </p>
      </div>

      {/* 指标：一条发丝线 + 四栏（首页数据带同款） */}
      <div className="energy-metrics">
        {metrics.map((m) => (
          <div className="metric-card" key={m.label}>
            <div className="metric-head">
              <m.icon size={16} />
              <span>{m.label}</span>
            </div>
            <div className="metric-value">
              <CountUp value={m.value} decimals={m.decimals} />
              <span className="metric-unit">{m.unit}</span>
            </div>
          </div>
        ))}
      </div>

        {/* 环境监测 + 调光 */}
        <div className="energy-grid">
          <section className="panel">
            <h3 className="panel-title">环境监测</h3>
            <ul className="env-list">
              {envItems.map((e) => (
                <li className="env-item" key={e.label}>
                  <e.icon size={16} />
                  <span className="env-label">{e.label}</span>
                  <span className="env-value">
                    {e.value == null ? '—' : <CountUp value={e.value} decimals={e.decimals} />}
                    <em>{e.unit}</em>
                  </span>
                </li>
              ))}
            </ul>
            <p className="panel-note">温湿度 / PM2.5 来自 Open-Meteo 实时数据，失败自动降级 Mock。</p>
          </section>

          <section className="panel">
            <h3 className="panel-title">自适应调光模拟</h3>
            <div className="dim-readout">
              <div className="dim-big">
                <CountUp value={brightness} />
                %
              </div>
              <div className="dim-sub">
                灯头功率 <b>{watt} W</b>
              </div>
            </div>

            <label className="dim-slider-label">
              <span>
                环境光照 <b>{light} lx</b> · {light < 200 ? '夜晚' : light < 500 ? '阴天 / 傍晚' : '白天'}
              </span>
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
              {CROWDS.map((c) => (
                <button key={c.key} className={`chip ${crowd === c.key ? 'on' : ''}`} onClick={() => setCrowd(c.key)}>
                  {c.label}
                </button>
              ))}
            </div>

            <p className="panel-note">规则：环境越暗、人流越多，亮度自动升高。拖动滑块模拟光照变化。</p>
          </section>
        </div>

      {/* 能源流向：一条发丝线 + 三栏 */}
      <section className="panel">
        <h3 className="panel-title">能源流向</h3>
        <ol className="flow">
          {flowNodes.map((n) => (
            <li className="flow-node" key={n.name}>
              <n.icon size={18} />
              <b>{n.name}</b>
              <small>{n.note}</small>
            </li>
          ))}
        </ol>
        <ul className="flow-notes">
          <li>白天光伏优先供电，余电储能；夜间储能 + 市电互补</li>
          <li>低位照明常亮，主灯按人流与光照自动调功</li>
        </ul>
      </section>
    </div>
  )
}
