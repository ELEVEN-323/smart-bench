import { Link } from 'react-router-dom'
import Logo from './Logo'

/**
 * 站点页脚
 * · 首页分屏（deck）开启时，它被放进最后一屏，与 CTA 同屏相连
 * · 分屏关闭（小屏 / 减少动效）时由 App 渲染在页面末尾
 * 两种情况下都只显示其中一份（见 index.css 的 .deck-page 规则）
 */
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand">
            <Logo size={22} />
            <span>智能助老座椅</span>
          </div>
          <p>
            社区级 AI 微服务站，以路灯杆为中轴、双侧长椅为载体，为长辈提供 24 小时在身边的守护。
          </p>
        </div>
        <div className="footer-col">
          <h4>产品</h4>
          <Link to="/structure">产品结构</Link>
          <Link to="/assistant">语音助手</Link>
          <Link to="/energy">照明能源</Link>
          <Link to="/">首页</Link>
        </div>
        <div className="footer-col">
          <h4>能力</h4>
          <Link to="/sos">紧急呼叫</Link>
          <Link to="/map">位置检索</Link>
          <Link to="/notice">信息发布</Link>
          <Link to="/call">视频通话</Link>
        </div>
        <div className="footer-col">
          <h4>支持</h4>
          <Link to="/privacy">隐私授权</Link>
          <Link to="/charge">扫码充电</Link>
          <a href="https://github.com/ELEVEN-323/smart-bench" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 智能助老座椅 · 社区级 AI 微服务站</span>
        <span>页面数据为演示占位</span>
      </div>
    </footer>
  )
}
