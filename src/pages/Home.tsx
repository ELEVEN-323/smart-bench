import { Link } from 'react-router-dom'
import './home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">智能助老座椅</h1>
        <p className="hero-sub">适老化智慧公共设施 · 可运行 Web Demo</p>
        <p className="hero-desc">
          本 Demo 演示「语音播报 + 大模型问答」能力，当前为 <strong>Mock 模式</strong>（无需 API Key）。
        </p>
        <Link to="/assistant" className="hero-btn">
          🎤 体验语音助手 →
        </Link>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🎤</div>
          <h3>语音助手</h3>
          <p>大模型问答 + 语音播报（已实现）</p>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">🆘</div>
          <h3>紧急呼叫</h3>
          <p>计划中 · D7</p>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">🗺️</div>
          <h3>位置检索</h3>
          <p>计划中 · D8</p>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">📹</div>
          <h3>视频通话</h3>
          <p>计划中 · D8</p>
        </div>
      </section>
    </div>
  )
}
