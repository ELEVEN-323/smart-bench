import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import HeroShapes from '../components/HeroShapes'
import LampAurora from '../components/LampAurora'
import Spotlight from '../components/Spotlight'
import BenchArt from '../components/BenchArt'
import './home.css'

const FEATURES = [
  { name: '语音助手', desc: '大模型问答 + 语音播报，随叫随应。', status: '已上线', done: true, to: '/assistant' },
  { name: '紧急呼叫', desc: '一键 SOS，语音安抚与自动升级。', status: '已上线', done: true, to: '/sos' },
  { name: '位置检索', desc: '附近医院、公交站，一键语音导航。', status: '已上线', done: true, to: '/map' },
  { name: '照明能源', desc: '光照与人流自适应调光，太阳能储能。', status: '已上线', done: true, to: '/energy' },
  { name: '信息发布', desc: '公告一键上屏，多杆实时同步。', status: '已上线', done: true, to: '/notice' },
  { name: '扫码充电', desc: '扶手充电口，扫码即充。', status: '已上线', done: true, to: '/charge' },
  { name: '隐私授权', desc: '健康数据授权与随时撤回。', status: '已上线', done: true, to: '/privacy' },
  { name: '视频通话', desc: '房间号配对，与家人面对面。', status: '模拟', done: false, to: '/call' },
  { name: '座椅 3D 展示', desc: '结构尺寸与适老细节。', status: '占位', done: false, to: '/structure' },
]

// 核心能力佐证：intuitionrobotics.com 式「大数字 + 对话气泡」。
// 数字只使用产品事实（1 键 / 24-7 值守 / 坐起靠三姿态），不编造疗效数据。
const PROOF = [
  { num: '1', unit: '键', label: 'SOS 紧急呼救', desc: '一键呼叫，语音安抚与自动预警', bubble: '已为您呼叫社区与家人，请保持通话。' },
  { num: '24/7', unit: '', label: '语音值守', desc: '大模型问答 + 语音播报，随叫随应', bubble: '早安，昨晚睡得好吗？' },
  { num: '3', unit: '姿态', label: '适老结构', desc: '坐 · 起 · 靠，处处照顾长辈', bubble: '扶手在这儿，我扶您慢慢起身。' },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <LampAurora />
        <HeroShapes />
        <Spotlight />
        <div className="hero-inner">
          <Reveal>
            <span className="hero-kicker">智慧公共设施 · 适老化</span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="hero-title">
              让每一次落座，
              <br />
              都<span className="accent shine">安心</span>。
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="hero-sub">
              面向老年群体的智慧座椅与灯杆，融合结构适老化、紧急救助、语音助手与便民服务。
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="hero-actions">
              <Link to="/assistant" className="btn btn-primary">
                体验语音助手
              </Link>
              <a
                href="#design"
                className="btn btn-ghost"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('design')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                了解设计
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="spec" id="design">
          <header className="sec-head">
            <span className="sec-index">01</span>
            <h2 className="sec-title">功能模块</h2>
          </header>
          <div className="spec-list">
            {FEATURES.map((f, i) => {
              const inner = (
                <>
                  <span className="spec-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="spec-name">{f.name}</h3>
                    <p className="spec-desc">{f.desc}</p>
                  </div>
                  <span className={`spec-status${f.done ? ' done' : ''}`}>{f.status}</span>
                </>
              )
              return f.to ? (
                <Link key={f.name} to={f.to} className="spec-row">
                  {inner}
                </Link>
              ) : (
                <div key={f.name} className="spec-row">
                  {inner}
                </div>
              )
            })}
          </div>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <section className="proof" aria-label="核心能力佐证">
          <header className="sec-head">
            <span className="sec-index">02</span>
            <h2 className="sec-title">一句话，就知道它靠得住</h2>
          </header>
          <div className="proof-grid">
            {PROOF.map((p) => (
              <div className="proof-card" key={p.label}>
                <div className="proof-num">
                  {p.num}
                  {p.unit && <span className="proof-unit">{p.unit}</span>}
                </div>
                <div className="proof-label">{p.label}</div>
                <div className="proof-desc">{p.desc}</div>
                <div className="bubble">{p.bubble}</div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <section className="showcase">
          <div className="showcase-media">
            <BenchArt />
            <span className="showcase-label">产品渲染图 · 由设计组提供</span>
          </div>
          <div className="showcase-text">
            <header className="sec-head">
              <span className="sec-index">03</span>
              <h2 className="sec-title">为长辈而设计</h2>
            </header>
            <p>
              略高座面、助起身扶手、高靠背与拐杖卡槽，从「坐、起、靠」每一个细节，照顾长辈的舒适与安全。
            </p>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
