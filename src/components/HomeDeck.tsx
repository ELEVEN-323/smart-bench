import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * 首页分屏舞台（deck）
 *
 * 结构：  .home.deck > .deck-stage（吸附、恒为一屏）> 若干 .deck-panel（absolute inset:0）
 *                  > .deck-track（只有高度，用来撑出滚动长度）
 *
 * 为什么这样切页：
 *   · 面板是 absolute 的，滚动时画面本身一动不动 → 不会出现“这一屏滚上去”的位移感
 *   · 同一时刻只有 .is-active 一屏 opacity:1，上一层淡出、下一层淡入，绝不重叠
 *   · 滚动位置仍是唯一事实来源：鼠标滚轮 / 键盘 / 圆点 / 拖滚动条 全都落到同一套索引上
 *   · 一屏装不下就加 .is-scroll 让它内部滚动，宁可内部滚也不压到别的屏
 *   · 小屏或「减少动效」时整体退化为普通长页面（.deck-off），不会出现叠屏
 */

let deckApi: { goToId: (id: string) => void } | null = null

/** 供页面内的按钮调用：切到指定 id 的那一屏 */
export function deckGoTo(id: string) {
  deckApi?.goToId(id)
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

/** 元素在文档流里的纵向位置（只对非 sticky 元素可靠） */
function docTopOf(el: HTMLElement) {
  let y = 0
  let cur: HTMLElement | null = el
  while (cur) {
    y += cur.offsetTop
    cur = cur.offsetParent as HTMLElement | null
  }
  return y
}

/**
 * 舞台在文档流里的位置（= 第 0 屏的滚动位置）。
 *
 * 千万不能对 .deck-stage 本身调 docTopOf：它吸住以后 offsetTop 会带上吸附位移，
 * 量出来是「当前滚动位置 + 顶栏高」，也就是会跟着滚动一路漂移，
 * 一旦写回缓存，屏索引就会越滚越离谱（滚一下跳三屏、往上滚反而往下走）。
 * 所以这里量它的父节点 .home.deck —— 普通流内元素，位置恒定。
 */
function deckFlowTop(stage: HTMLElement) {
  const root = stage.parentElement
  return docTopOf(root && root.classList.contains('home') ? root : stage)
}

interface DeckMetrics {
  stageH: number
  homeTop: number
  max: number
  lock: number
  raf: number
  target: number
  lastWheel: number
  off: boolean
  active: number
}

export default function HomeDeck({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLElement[]>([])
  const S = useRef<DeckMetrics>({
    stageH: 0,
    homeTop: 0,
    max: 0,
    lock: 0,
    raf: 0,
    target: -1,
    lastWheel: 0,
    off: false,
    active: 0,
  })

  const [n, setN] = useState(0)
  const [active, setActive] = useState(0)
  const [off, setOff] = useState(false)
  const [labels, setLabels] = useState<string[]>([])

  /* ---------- 1. 收集面板（只认 .deck-panel，排除控件层） ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const ps = Array.from(stage.children).filter((c) =>
      (c as HTMLElement).classList.contains('deck-panel'),
    ) as HTMLElement[]
    panelsRef.current = ps
    if (ps.length !== n) {
      setN(ps.length)
      setLabels(ps.map((p) => p.dataset.label || ''))
    }
  })

  /* ---------- 2. 命令式切换高亮 / inert / 模式类名（不触发整页重渲染） ---------- */
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const on = !off
    document.documentElement.classList.toggle('deck-page', on)
    stage.parentElement?.classList.toggle('deck-off', !on)
    panelsRef.current.forEach((p, i) => {
      const isActive = on && i === active
      p.classList.toggle('is-active', isActive)
      p.toggleAttribute('inert', on && !isActive)
    })
  })

  /* 离开首页时把全局类摘掉 */
  useEffect(
    () => () => {
      document.documentElement.classList.remove('deck-page')
    },
    [],
  )

  /* ---------- 3. 量尺寸 ---------- */
  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    S.current.stageH = stage.offsetHeight
    S.current.homeTop = deckFlowTop(stage)
    S.current.max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    /* 装不下的一屏 → 内部滚动（装得下就自动摘掉类） */
    panelsRef.current.forEach((p) => {
      p.classList.toggle('is-scroll', p.scrollHeight > p.clientHeight + 2)
    })
  }, [])

  /* ---------- 4. 由滚动位置反推当前是第几屏 ---------- */
  const sync = useCallback(() => {
    const { stageH, homeTop } = S.current
    const total = panelsRef.current.length
    if (!stageH || total === 0) return
    const i = clamp(Math.round((window.scrollY - homeTop) / stageH), 0, total - 1)
    S.current.active = i
    setActive((prev) => (prev === i ? prev : i))
  }, [])

  /* ---------- 5. 翻到第 i 屏 ---------- */
  const go = useCallback((i: number) => {
    const stage = stageRef.current
    const total = panelsRef.current.length
    if (!stage || total === 0 || S.current.off) return
    const idx = clamp(Math.round(i), 0, total - 1)
    /* 现场取值，不依赖缓存：面板数量或窗口一变，缓存就可能过期 */
    const stageH = stage.offsetHeight || S.current.stageH
    const homeTop = deckFlowTop(stage)
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    S.current.stageH = stageH
    S.current.homeTop = homeTop
    S.current.max = max
    const y = clamp(homeTop + idx * stageH, 0, max)
    S.current.target = y
    S.current.lock = performance.now() + 900
    window.scrollTo({ top: y, behavior: 'smooth' })
  }, [])

  const goToId = useCallback(
    (id: string) => {
      const el = panelsRef.current.find((p) => p.id === id)
      if (!el) return
      if (S.current.off) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      go(panelsRef.current.indexOf(el))
    },
    [go],
  )

  /* ---------- 6. 是否退化为普通长页面 ---------- */
  const applyMode = useCallback(() => {
    const next =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerHeight < 560 ||
      window.innerWidth < 900
    S.current.off = next
    setOff((prev) => (prev === next ? prev : next))
  }, [])

  /* ---------- 7. 监听 ---------- */
  useLayoutEffect(() => {
    try {
      applyMode()
      measure()
      sync()
    } catch {
      /* 万一量算失败：降级为普通长页面，绝不把面板留在看不见的状态 */
      S.current.off = true
      setOff(true)
    }
    /* 字体 / 折叠面板晚一步落位会改变面板高度，补量两次 */
    const t1 = window.setTimeout(() => {
      measure()
      sync()
    }, 400)
    const t2 = window.setTimeout(() => {
      measure()
      sync()
    }, 1500)
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          measure()
          sync()
        })
        .catch(() => undefined)
    }
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [applyMode, measure, sync])

  /* ---------- 面板数量（撑出滚动长度的 spacers）或模式变化后必须重新量 ---------- */
  useLayoutEffect(() => {
    measure()
    sync()
  }, [n, off, measure, sync])

  useEffect(() => {
    const onScroll = () => {
      if (S.current.raf) return
      S.current.raf = requestAnimationFrame(() => {
        S.current.raf = 0
        sync()
      })
    }
    const onScrollEnd = () => {
      /* 停在目标位置、且滚轮已经安静下来 → 提前解锁，下一次滚动立刻响应 */
      if (
        S.current.target >= 0 &&
        Math.abs(window.scrollY - S.current.target) < 8 &&
        performance.now() - S.current.lastWheel > 160
      ) {
        S.current.lock = 0
      }
    }
    const onWheel = (e: WheelEvent) => {
      const now = performance.now()
      S.current.lastWheel = now
      if (S.current.off || e.ctrlKey || e.metaKey) return
      /* 当前屏自身还能滚就先把它滚完 */
      const cur = panelsRef.current[S.current.active]
      if (cur && cur.classList.contains('is-scroll')) {
        const canDown = cur.scrollTop + cur.clientHeight < cur.scrollHeight - 2
        const canUp = cur.scrollTop > 2
        if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) return
      }
      if (Math.abs(e.deltaY) < 1.5) return
      e.preventDefault()
      /* 一次手势只翻一屏：手势还在继续（触控板惯性）就把锁往后顺延 */
      if (now < S.current.lock) {
        S.current.lock = Math.max(S.current.lock, now + 220)
        return
      }
      go(S.current.active + (e.deltaY > 0 ? 1 : -1))
    }
    const onKey = (e: KeyboardEvent) => {
      if (S.current.off || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
      let d = 0
      if (e.key === 'PageDown') d = 1
      else if (e.key === 'PageUp') d = -1
      else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        /* 焦点在按钮 / 链接 / 折叠面板上时，方向键交还浏览器 */
        if (t?.closest('a, button, [role="button"], .ant-collapse')) return
        d = e.key === 'ArrowDown' ? 1 : -1
      } else if (e.key === 'Home') {
        e.preventDefault()
        go(0)
        return
      } else if (e.key === 'End') {
        e.preventDefault()
        go(panelsRef.current.length - 1)
        return
      } else {
        return
      }
      e.preventDefault()
      if (performance.now() < S.current.lock) return
      go(S.current.active + d)
    }
    const onResize = () => {
      applyMode()
      measure()
      sync()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      if (S.current.raf) cancelAnimationFrame(S.current.raf)
    }
  }, [applyMode, go, measure, sync])

  /* ---------- 8. 注册给页面内按钮用 ---------- */
  useEffect(() => {
    deckApi = { goToId }
    return () => {
      if (deckApi?.goToId === goToId) deckApi = null
    }
  }, [goToId])

  return (
    <>
      <div className="deck-stage" ref={stageRef}>
        {children}
        {!off && (
          <div className="deck-ui">
            <div className="deck-dots">
              {labels.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  className={`deck-dot${i === active ? ' is-on' : ''}`}
                  aria-label={label || `第 ${i + 1} 屏`}
                  aria-current={i === active || undefined}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className={`deck-arrow${active >= n - 1 ? ' is-hidden' : ''}`}
              aria-label="下一屏"
              onClick={() => go(active + 1)}
            >
              <ChevronDown size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div className="deck-track" aria-hidden="true">
        {Array.from({ length: Math.max(0, n - 1) }, (_, i) => (
          <div className="deck-spacer" key={i} />
        ))}
      </div>
    </>
  )
}
