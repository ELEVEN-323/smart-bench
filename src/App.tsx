import { Routes, Route, NavLink } from 'react-router-dom'
import Logo from './components/Logo'
import Home from './pages/Home'
import Assistant from './pages/Assistant'
import Sos from './pages/Sos'
import MapPage from './pages/Map'
import Energy from './pages/Energy'
import Charge from './pages/Charge'
import Notice from './pages/Notice'
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
  { to: '/charge', label: '扫码充电' },
  { to: '/privacy', label: '隐私授权' },
  { to: '/call', label: '视频通话' },
  { to: '/structure', label: '3D 展示' },
]

export default function App() {
  return (
    <div className="app">
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
          <Route path="/charge" element={<Charge />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/call" element={<Call />} />
          <Route path="/structure" element={<Structure />} />
        </Routes>
      </main>
      <footer className="footer">
        智能助老座椅 · 智慧公共设施 ·{' '}
        <a href="https://github.com/ELEVEN-323/smart-bench" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}
