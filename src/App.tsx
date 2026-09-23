import { Routes, Route, NavLink } from 'react-router-dom'
import Logo from './components/Logo'
import Home from './pages/Home'
import Assistant from './pages/Assistant'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo size={26} />
          <span>智能助老座椅</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            首页
          </NavLink>
          <NavLink to="/assistant" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            语音助手
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
        智能助老座椅 · 智慧公共设施 ·{' '}
        <a href="https://github.com/ELEVEN-323/smart-bench" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </footer>
    </div>
  )
}
