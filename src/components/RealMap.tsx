import { useEffect, useRef } from 'react'
import { getMapConfig, type Poi } from '../services/map'

declare global {
  interface Window {
    AMap?: any
    _AMapSecurityConfig?: { securityJsCode?: string }
  }
}

const SCRIPT_URL = (key: string) => `https://webapi.amap.com/maps?v=2.0&key=${key}`

/**
 * 高德地图画布：配置了 VITE_AMAP_KEY 时渲染真实地图 + 设施标记；
 * 未配置时返回 null，由父组件回退到 CSS 模拟图。
 * 任何加载/初始化失败都静默返回，保证页面永不崩溃。
 */
export default function RealMap({ pois }: { pois: Poi[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const poisRef = useRef<Poi[]>(pois)
  poisRef.current = pois

  const config = getMapConfig()

  /* 初始化地图（只做一次） */
  useEffect(() => {
    if (!config.enabled || !ref.current) return
    let alive = true

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        if (window.AMap) return resolve()
        const s = document.createElement('script')
        s.src = SCRIPT_URL(config.key)
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('高德地图脚本加载失败'))
        document.head.appendChild(s)
      })

    ;(async () => {
      try {
        if (config.securityCode) {
          window._AMapSecurityConfig = { securityJsCode: config.securityCode }
        }
        await loadScript()
        if (!alive || !window.AMap || !ref.current) return
        const map = new window.AMap.Map(ref.current, { zoom: 15, center: config.center, viewMode: '2D' })
        mapRef.current = map
        syncMarkers(map, poisRef.current)
      } catch (err) {
        console.error('高德地图初始化失败（回退到模拟图）：', err)
      }
    })()

    return () => {
      alive = false
      if (mapRef.current) {
        try {
          mapRef.current.destroy?.()
        } catch {
          /* noop */
        }
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, config.key, config.securityCode])

  /* 筛选结果变化时，只同步标记，不重建地图 */
  useEffect(() => {
    if (mapRef.current && window.AMap) syncMarkers(mapRef.current, pois)
  }, [pois])

  if (!config.enabled) return null

  return <div className="map-canvas" ref={ref} />
}

function syncMarkers(map: any, pois: Poi[]) {
  try {
    map.clearMap?.()
    const markers = pois
      .filter((p) => p.lnglat)
      .map((p) => new window.AMap.Marker({ position: p.lnglat, title: p.name }))
    if (markers.length) {
      map.add(markers)
      map.setFitView(markers)
    }
  } catch {
    /* 标记同步失败也不影响地图本身 */
  }
}
