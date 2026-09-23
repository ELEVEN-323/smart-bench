import { Link } from 'react-router-dom'
import './home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <span className="hero-tag">🏡 温暖相伴 · 安心依靠</span>
        <h1 className="hero-title">欢迎来到智能助老座椅</h1>
        <p className="hero-sub">用科技守护每一位长辈</p>
        <p className="hero-desc">
          让每一次停留都安心、舒适。语音助手随时待命，紧急情况一键求助。
        </p>
        <Link to="/assistant" className="hero-btn">
          🎤 和助手说句话 →
        </Link>
      </section>

      <section className="feature-grid">
        <div className="feature-card done">
          <div className="feature-icon">🎤</div>
          <h3>语音助手</h3>
          <p>大模型问答 + 语音播报</p>
          <span className="feature-badge">已上线</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">🆘</div>
          <h3>紧急呼叫</h3>
          <p>一键呼叫，语音安抚</p>
          <span className="feature-badge soon">规划中</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">🗺️</div>
          <h3>位置检索</h3>
          <p>附近医院、公交站</p>
          <span className="feature-badge soon">规划中</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">📹</div>
          <h3>视频通话</h3>
          <p>与家人面对面</p>
          <span className="feature-badge soon">规划中</span>
        </div>
      </section>
    </div>
  )
}
