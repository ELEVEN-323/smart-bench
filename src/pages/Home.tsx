import { Link } from 'react-router-dom'
import BenchArt from '../components/BenchArt'
import './home.css'

const FEATURES = [
  { name: '语音助手', desc: '大模型问答 + 语音播报，随叫随应。', status: '已上线', done: true },
  { name: '紧急呼叫', desc: '一键 SOS，语音安抚与自动预警。', status: '规划中' },
  { name: '位置检索', desc: '附近医院、公交站快速导航。', status: '规划中' },
  { name: '视频通话', desc: '与家人实时面对面。', status: '规划中' },
]

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <span className="hero-kicker">智慧公共设施 · 适老化</span>
        <h1 className="hero-title">
          让每一次落座，
          <br />
          都<span className="accent">安心</span>。
        </h1>
        <p className="hero-sub">
          面向老年群体的智慧座椅与灯杆，融合结构适老化、紧急救助、语音助手与便民服务。
        </p>
        <div className="hero-actions">
          <Link to="/assistant" className="btn btn-primary">
            体验语音助手
          </Link>
          <a href="#design" className="btn btn-ghost">
            了解设计
          </a>
        </div>
      </section>

      <section className="spec" id="design">
        <header className="sec-head">
          <span className="sec-index">01</span>
          <h2 className="sec-title">功能模块</h2>
        </header>
        <div className="spec-list">
          {FEATURES.map((f, i) => (
            <div key={f.name} className="spec-row">
              <span className="spec-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="spec-name">{f.name}</h3>
                <p className="spec-desc">{f.desc}</p>
              </div>
              <span className={`spec-status${f.done ? ' done' : ''}`}>{f.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="showcase">
        <div className="showcase-media">
          <BenchArt />
          <span className="showcase-label">产品渲染图 · 由设计组提供</span>
        </div>
        <div className="showcase-text">
          <header className="sec-head">
            <span className="sec-index">02</span>
            <h2 className="sec-title">为长辈而设计</h2>
          </header>
          <p>
            略高座面、助起身扶手、高靠背与拐杖卡槽，从「坐、起、靠」每一个细节，照顾长辈的舒适与安全。
          </p>
        </div>
      </section>
    </div>
  )
}
