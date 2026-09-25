import { useEffect, useMemo, useState } from 'react'
import './charge.css'

/** 演示用伪二维码（确定性图案，不真实可扫，仅示意） */
function FakeQr() {
  const cells = useMemo(() => {
    const n = 25
    const grid: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false))
    // 三个定位角
    const finder = (r0: number, c0: number) => {
      for (let r = r0; r < r0 + 7; r++)
        for (let c = c0; c < c0 + 7; c++) {
          const ring = r === r0 || r === r0 + 6 || c === c0 || c === c0 + 6
          const core = r >= r0 + 2 && r <= r0 + 4 && c >= c0 + 2 && c <= c0 + 4
          grid[r][c] = ring || core
        }
    }
    finder(0, 0)
    finder(0, n - 7)
    finder(n - 7, 0)
    // 伪随机数据区（确定性种子）
    let seed = 42
    const rand = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648
      return seed / 2147483648
    }
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) {
        if (r < 8 && c < 8) continue
        if (r < 8 && c >= n - 8) continue
        if (r >= n - 8 && c < 8) continue
        grid[r][c] = rand() > 0.52
      }
    return grid
  }, [])

  const n = cells.length
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="qr-svg" aria-hidden="true">
      {cells.map((row, r) =>
        row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} /> : null)),
      )}
    </svg>
  )
}

export default function Charge() {
  const [level, setLevel] = useState(12)
  const [charging, setCharging] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [port, setPort] = useState('USB-C')

  useEffect(() => {
    if (!charging) return
    const t = setInterval(() => {
      setElapsed((e) => e + 1)
      setLevel((l) => {
        if (l >= 100) {
          setCharging(false)
          return 100
        }
        return l + 2
      })
    }, 400)
    return () => clearInterval(t)
  }, [charging])

  const start = () => {
    if (charging || level >= 100) return
    setLevel(12)
    setElapsed(0)
    setCharging(true)
  }

  const stop = () => setCharging(false)
  const fee = (elapsed * 0.01).toFixed(2)

  return (
    <div className="charge">
      <div className="page-head">
        <h2>🔌 扫码充电</h2>
        <p className="page-sub">
          座椅扶手内嵌充电口，扫码即充
          <span className="page-note">（演示为模拟充电流程，电量与费用为假数据）</span>
        </p>
      </div>

      <div className="charge-layout">
        <section className="panel qr-panel">
          <h3 className="panel-title">第一步：扫码</h3>
          <div className="qr-card">
            <FakeQr />
            <p className="qr-hint">演示用示意码 · 点击下方「开始充电」进入模拟</p>
          </div>
          <div className="charge-steps">
            <span className="charge-step done">① 扫码</span>
            <span className={`charge-step ${charging ? 'done' : 'active'}`}>② 充电中</span>
            <span className={`charge-step ${level >= 100 ? 'done' : ''}`}>③ 完成</span>
          </div>
        </section>

        <section className="panel battery-panel">
          <h3 className="panel-title">充电状态</h3>

          <div className="port-row">
            <span className="dim-slider-label">充电口：</span>
            {['USB-C', '无线充电'].map((p) => (
              <button key={p} className={`chip ${port === p ? 'on' : ''}`} onClick={() => setPort(p)}>
                {p}
              </button>
            ))}
          </div>

          <div className={`battery ${charging ? 'charging' : ''} ${level >= 100 ? 'full' : ''}`}>
            <div className="battery-nub" />
            <div className="battery-body">
              <div className="battery-fill" style={{ width: `${level}%` }} />
              <span className="battery-text">{level}%</span>
            </div>
          </div>

          <div className="charge-stats">
            <div className="stat">
              <span className="stat-label">已充时长</span>
              <b className="stat-value">{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</b>
            </div>
            <div className="stat">
              <span className="stat-label">预计费用</span>
              <b className="stat-value">¥ {fee}</b>
            </div>
            <div className="stat">
              <span className="stat-label">状态</span>
              <b className="stat-value">{charging ? '充电中' : level >= 100 ? '已充满' : '未充电'}</b>
            </div>
          </div>

          <div className="charge-actions">
            <button className="btn-primary-inline" onClick={start} disabled={charging}>
              {level >= 100 ? '重新充电' : '开始充电'}
            </button>
            {charging && (
              <button className="sos-sub-btn" onClick={stop}>
                停止
              </button>
            )}
          </div>

          <p className="charge-note">公益便民：每 10 分钟仅 0.1 元（演示费率），充满自动断电。</p>
        </section>
      </div>
    </div>
  )
}
