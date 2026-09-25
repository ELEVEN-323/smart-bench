import { useEffect, useRef } from 'react'

/**
 * 光标跟随高光（零依赖）
 *
 * 参考来源：React Bits 的 Spotlight / Linear 的鼠标跟随高光。
 * 只写 CSS 变量，动画交给 CSS，不触发 React 重渲染。
 *
 * 默认关闭条件：
 *  - prefers-reduced-motion: reduce（无障碍）
 *  - 触屏设备（没有光标，跟随无意义且徒增功耗）
 */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
        el.style.setProperty('--spot-opacity', '1')
      })
    }
    const onLeave = () => el.style.setProperty('--spot-opacity', '0')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="hero-spotlight" aria-hidden="true" />
}
