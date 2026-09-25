// 信息发布实时同步：BroadcastChannel（同浏览器多窗口）+ localStorage 持久化
// 这是 Supabase Realtime 接入前的降级方案（TECH_PLAN 风险预案）。
// 接口按「订阅 / 变更」设计，将来切 Supabase 时页面无需改动。

export interface Notice {
  id: string
  title: string
  content: string
  published: boolean
  createdAt: number
}

const LS_KEY = 'smart-bench:notices'
const CHANNEL = 'smart-bench:notices'

function seed(): Notice[] {
  const now = Date.now()
  return [
    { id: 'n1', title: '社区老年体检通知', content: '本周六上午 8:30–11:30 在社区卫生服务中心开展免费体检，请携带身份证。', published: true, createdAt: now - 86400000 * 2 },
    { id: 'n2', title: '戏曲票友会活动报名', content: '周五下午 2 点，春晖公园凉亭，黄梅戏《天仙配》选段，欢迎参与。', published: true, createdAt: now - 86400000 },
    { id: 'n3', title: '供水管道检修公告', content: '周三 9:00–17:00 部分楼栋停水，请提前储水。', published: false, createdAt: now - 3600000 },
  ]
}

function load(): Notice[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as Notice[]
  } catch {
    /* 忽略损坏数据 */
  }
  return seed()
}

const listeners = new Set<(list: Notice[]) => void>()
let channel: BroadcastChannel | null = null

function emit(): void {
  const list = load()
  listeners.forEach((cb) => cb(list))
}

function ensureChannel(): void {
  if (channel || typeof BroadcastChannel === 'undefined') return
  channel = new BroadcastChannel(CHANNEL)
  channel.addEventListener('message', emit)
}

function commit(list: Notice[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
  emit() // 本标签页立即更新
  ensureChannel()
  channel?.postMessage({ ts: Date.now() }) // 其他标签页同步
}

/** 订阅公告列表，返回取消订阅函数 */
export function subscribeNotices(cb: (list: Notice[]) => void): () => void {
  listeners.add(cb)
  cb(load())
  const onStorage = (e: StorageEvent) => {
    if (e.key === LS_KEY) emit()
  }
  window.addEventListener('storage', onStorage)
  ensureChannel()
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', onStorage)
  }
}

export function addNotice(title: string, content: string): void {
  const list = load()
  list.unshift({ id: `n${Date.now()}`, title, content, published: false, createdAt: Date.now() })
  commit(list)
}

export function setPublished(id: string, published: boolean): void {
  commit(load().map((n) => (n.id === id ? { ...n, published } : n)))
}

export function removeNotice(id: string): void {
  commit(load().filter((n) => n.id !== id))
}
