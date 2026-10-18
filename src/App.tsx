import { useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Logo from './components/Logo'
import SiteFooter from './components/SiteFooter'
import Home from './pages/Home'
import Assistant from './pages/Assistant'
import Sos from './pages/Sos'
import MapPage from './pages/Map'
import Energy from './pages/Energy'
import Charge from './pages/Charge'
import Notice from './pages/Notice'
import Linkage from './pages/Linkage'
import Privacy from './pages/Privacy'
import Call from './pages/Call'
import Structure from './pages/Structure'

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/assistant', label: '语音助手' },
  { to: '/sos', label: '紧急呼叫' },
  { to: '/map', label: '位置检索' },
  { to: '/energy', label: '照明能源' },
  { to: '/notice', label: '信息发布' },
  { to: '/linkage', label: '多杆联动' },
  { to: '/charge', label: '扫码充电' },
  { to: '/privacy', label: '隐私授权' },
  { to: '/call', label: '视频通话' },
  { to: '/structure', label: '3D 展示' },
]

/** 路由切换时回到顶部：否则从首页深处跳到别的页面会停在半空 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const html = document.documentElement
    const prev = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto' // 关掉平滑，避免几千像素的长距离滚动
    window.scrollTo(0, 0)
    html.style.scrollBehavior = prev
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <header className="topbar">
        <div className="brand">
          <Logo size={26} />
          <span>智能助老座椅</span>
        </div>
        <nav className="nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/sos" element={<Sos />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/energy" element={<Energy />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/linkage" element={<Linkage />} />
          <Route path="/charge" element={<Charge />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/call" element={<Call />} />
          <Route path="/structure" element={<Structure />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
