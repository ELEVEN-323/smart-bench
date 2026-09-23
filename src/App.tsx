import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Assistant from './pages/Assistant'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">🧓 智能助老座椅</div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            🏠 首页
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            🎤 语音助手
          </NavLink>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assistant />} />
        </Routes>
      </main>
      <footer className="footer">
        智能助老座椅 · 演示版 Demo ·{' '}
        <a href="https://github.com/ELEVEN-323/smart-bench" target="_blank" rel="noreferrer">
          GitHub 仓库
        </a>
      </footer>
    </div>
  )
}
