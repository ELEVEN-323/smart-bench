// 座位状态 · 多杆联动：BroadcastChannel（同浏览器多窗口）+ localStorage 持久化。
// 这是 Supabase Realtime 接入前的降级方案（TECH_PLAN 风险预案）。
// 接口按「订阅 / 变更」设计，将来切 Supabase 时页面无需改动。
//
// ── Supabase 真·跨设备接入（需先创建项目 + 配置 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）──
// 1) 建表：
//    create table seats (
//      id bigint primary key generated always as identity,
//      pole_id text not null,
//      seat_no int not null,
//      occupied boolean default false,
//      updated_at timestamptz default now()
//    );
// 2) 安装依赖：pnpm add @supabase/supabase-js
// 3) 本文件把 BroadcastChannel 实现换成 createClient + channel.on('postgres_changes', ...)

export interface Seat {
  id: string // `${poleId}-${seatNo}`
  poleId: string
  seatNo: number // 1=普通长椅，2=适老长椅
  occupied: boolean
  updatedAt: number
}

export const POLES = ['pole-01', 'pole-02', 'pole-03'] as const

export const SEAT_NO = [
  { no: 1, label: '普通长椅' },
  { no: 2, label: '适老长椅' },
] as const

export function seatLabel(seatNo: number): string {
  return SEAT_NO.find((s) => s.no === seatNo)?.label ?? `座位 ${seatNo}`
}

const LS_KEY = 'smart-bench:seats'
const CHANNEL = 'smart-bench:seats'

function seed(): Seat[] {
  const now = Date.now()
  const seats: Seat[] = []
  for (const poleId of POLES) {
    for (const { no } of SEAT_NO) {
      seats.push({ id: `${poleId}-${no}`, poleId, seatNo: no, occupied: false, updatedAt: now })
    }
  }
  // 预置一个「使用中」状态，让演示更直观
  seats[0].occupied = true
  return seats
}

function load(): Seat[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const arr = JSON.parse(raw) as Seat[]
      if (Array.isArray(arr) && arr.length) return arr
    }
  } catch {
    /* 忽略损坏数据 */
  }
  return seed()
}

const listeners = new Set<(list: Seat[]) => void>()
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

function commit(list: Seat[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(list))
  emit() // 本标签页立即更新
  ensureChannel()
  channel?.postMessage({ ts: Date.now() }) // 其他标签页同步
}

/** 订阅全部座位状态，返回取消订阅函数 */
export function subscribeSeats(cb: (list: Seat[]) => void): () => void {
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

/** 切换某个座位的占用状态 */
export function setOccupied(id: string, occupied: boolean): void {
  commit(load().map((s) => (s.id === id ? { ...s, occupied, updatedAt: Date.now() } : s)))
}

/** 重置所有座位为空 */
export function resetSeats(): void {
  commit(load().map((s) => ({ ...s, occupied: false, updatedAt: Date.now() })))
}
