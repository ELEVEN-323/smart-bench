import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Segmented } from 'antd'
import { Armchair, Radio, RotateCcw } from 'lucide-react'
import { subscribeSeats, setOccupied, resetSeats, POLES, SEAT_NO, seatLabel, type Seat } from '../services/seats'
import './linkage.css'

/**
 * 多杆联动：多根灯杆座椅的座位状态实时互通。
 * 演示技巧：开两个浏览器窗口，地址分别带 ?pole=pole-01 与 ?pole=pole-02，
 * 在一个窗口点「坐下」，另一个窗口的「全区总览」会实时变红。
 */
export default function Linkage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [seats, setSeats] = useState<Seat[]>([])
  const pole = searchParams.get('pole') || POLES[0]

  useEffect(() => subscribeSeats(setSeats), [])

  const currentSeats = seats.filter((s) => s.poleId === pole).sort((a, b) => a.seatNo - b.seatNo)
  const occupiedCount = seats.filter((s) => s.occupied).length

  const selectPole = (p: string) => setSearchParams({ pole: p })

  return (
    <div className="linkage">
      <div className="page-head">
        <span className="page-kicker">社区服务</span>
        <h2>多杆联动</h2>
        <p className="page-sub">
          多根灯杆座椅互联互通，座位状态实时同步
          <span className="page-note">（当前：同浏览器多窗口实时联动）</span>
        </p>
      </div>

      <div className="linkage-stats">
        <div className="stat-chip">
          <b>{POLES.length}</b> 根灯杆
        </div>
        <div className="stat-chip">
          <b>{occupiedCount}</b> / {seats.length} 个座位使用中
        </div>
      </div>

      <div className="panel">
        <div className="panel-head-row">
          <h3 className="panel-title">当前灯杆</h3>
          <Segmented
            value={pole}
            onChange={(v) => selectPole(v as string)}
            options={POLES.map((p) => ({ label: p, value: p }))}
          />
        </div>

        <div className="seat-grid">
          {currentSeats.map((s) => (
            <div key={s.id} className={`seat-card ${s.occupied ? 'occupied' : ''}`}>
              <div className="seat-icon">
                <Armchair size={30} />
              </div>
              <div className="seat-info">
                <h4>{seatLabel(s.seatNo)}</h4>
                <span className="seat-status">{s.occupied ? '使用中' : '空闲'}</span>
              </div>
              <button
                className={`seat-toggle ${s.occupied ? 'on' : ''}`}
                onClick={() => setOccupied(s.id, !s.occupied)}
              >
                {s.occupied ? '设为空闲' : '有人坐下'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head-row">
          <h3 className="panel-title">全区总览</h3>
          <button className="mini-btn" onClick={resetSeats}>
            <RotateCcw size={14} />
            重置全部
          </button>
        </div>

        <div className="overview-grid">
          {POLES.map((p) => (
            <div key={p} className={`overview-pole ${p === pole ? 'active' : ''}`}>
              <div className="overview-pole-name">
                <Radio size={14} />
                {p}
              </div>
              {SEAT_NO.map(({ no, label }) => {
                const s = seats.find((x) => x.poleId === p && x.seatNo === no)
                const occ = s?.occupied
                return (
                  <div key={no} className={`overview-cell ${occ ? 'occupied' : ''}`} title={`${p} · ${label}`}>
                    {label}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <p className="linkage-tip">
          演示：开两个窗口，一个用 <code>?pole=pole-01</code>、另一个 <code>?pole=pole-02</code>，在任一窗口点「有人坐下」，另一窗口的座位会实时变红。
        </p>
      </div>
    </div>
  )
}
