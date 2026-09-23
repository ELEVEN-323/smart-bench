import { Link } from 'react-router-dom'
import { MicIcon, AlertIcon, MapPinIcon, VideoIcon } from '../components/icons'
import BenchArt from '../components/BenchArt'
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
          <div className="feature-icon">
            <MicIcon size={34} color="#4a8a5e" />
          </div>
          <h3>语音助手</h3>
          <p>大模型问答 + 语音播报</p>
          <span className="feature-badge">已上线</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">
            <AlertIcon size={34} color="#cf6f2f" />
          </div>
          <h3>紧急呼叫</h3>
          <p>一键呼叫，语音安抚</p>
          <span className="feature-badge soon">规划中</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">
            <MapPinIcon size={34} color="#cf6f2f" />
          </div>
          <h3>位置检索</h3>
          <p>附近医院、公交站</p>
          <span className="feature-badge soon">规划中</span>
        </div>
        <div className="feature-card dim">
          <div className="feature-icon">
            <VideoIcon size={34} color="#cf6f2f" />
          </div>
          <h3>视频通话</h3>
          <p>与家人面对面</p>
          <span className="feature-badge soon">规划中</span>
        </div>
      </section>

      <section className="showcase">
        <div className="showcase-text">
          <h2>为长辈而设计</h2>
          <p>略高座面、助起身扶手、高靠背，结合紧急呼叫与语音助手，让公共座椅更贴心。</p>
          <ul className="showcase-tags">
            <li>适老化尺寸</li>
            <li>安全应急</li>
            <li>健康关怀</li>
            <li>便民服务</li>
          </ul>
        </div>
        <div className="showcase-img">
          <BenchArt />
          <span className="showcase-note">产品渲染图 · 待设计组提供</span>
        </div>
      </section>
    </div>
  )
}
