import { useEffect, useState } from 'react'
import { subscribeNotices, addNotice, setPublished, removeNotice, type Notice } from '../services/realtime'
import './notice.css'

/**
 * 信息发布：管理端编辑 → 屏端实时显示。
 * 同步机制：BroadcastChannel + localStorage（Supabase Realtime 接入前的降级方案）。
 * 演示技巧：开两个浏览器窗口，一个停在「屏端显示」，另一个「管理发布」点发布，屏端立即出现。
 */

function fmtTime(t: number): string {
  const d = new Date(t)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Notice() {
  const [tab, setTab] = useState<'screen' | 'admin'>('screen')
  const [notices, setNotices] = useState<Notice[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => subscribeNotices(setNotices), [])

  const submit = () => {
    if (!title.trim() || !content.trim()) return
    addNotice(title.trim(), content.trim())
    setTitle('')
    setContent('')
  }

  const published = notices.filter((n) => n.published)

  return (
    <div className="notice">
      <div className="page-head">
        <h2>📢 信息发布</h2>
        <p className="page-sub">
          社区公告一键上屏，多杆实时同步
          <span className="page-note">（开两个窗口：一个发布、一个屏显，可看实时联动）</span>
        </p>
      </div>

      <div className="notice-tabs">
        <button className={`tab ${tab === 'screen' ? 'on' : ''}`} onClick={() => setTab('screen')}>
          🖥 屏端显示
        </button>
        <button className={`tab ${tab === 'admin' ? 'on' : ''}`} onClick={() => setTab('admin')}>
          🛠 管理发布
        </button>
      </div>

      {tab === 'screen' ? (
        <ul className="screen-list">
          {published.map((n) => (
            <li key={n.id} className="screen-item">
              <h3 className="screen-title">{n.title}</h3>
              <p className="screen-content">{n.content}</p>
              <span className="screen-time">{fmtTime(n.createdAt)}</span>
            </li>
          ))}
          {published.length === 0 && <li className="screen-empty">暂无已发布的公告</li>}
        </ul>
      ) : (
        <div className="admin-layout">
          <section className="panel">
            <h3 className="panel-title">新建公告</h3>
            <input
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="公告标题，例如：社区体检通知"
            />
            <textarea
              className="admin-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="公告内容…"
              rows={4}
            />
            <button className="btn-primary-inline" onClick={submit} disabled={!title.trim() || !content.trim()}>
              保存草稿
            </button>
          </section>

          <section className="panel">
            <h3 className="panel-title">全部公告（{notices.length}）</h3>
            <ul className="admin-list">
              {notices.map((n) => (
                <li key={n.id} className={`admin-item ${n.published ? 'pub' : ''}`}>
                  <div className="admin-item-main">
                    <b>{n.title}</b>
                    <span className="admin-item-meta">
                      {fmtTime(n.createdAt)} · {n.published ? '🟢 已发布' : '⚪ 草稿'}
                    </span>
                    <p className="admin-item-content">{n.content}</p>
                  </div>
                  <div className="admin-item-actions">
                    <button className="mini-btn" onClick={() => setPublished(n.id, !n.published)}>
                      {n.published ? '下线' : '发布'}
                    </button>
                    <button className="mini-btn danger" onClick={() => removeNotice(n.id)}>
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  )
}
