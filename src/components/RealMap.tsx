import { useEffect, useRef } from 'react'
import { createMap, loadPlugin } from '../services/amap'
import type { Poi } from '../services/map'

export interface RouteInfo {
  distanceM: number
  minutes: number
  steps: string[]
}

/**
 * 高德地图画布：渲染真实地图 + 「我的位置」原点 + 设施标记 + 步行路线。
 * center 必须已确定（由父组件定位后传入）。
 */
export default function RealMap({
  pois,
  center,
  navTarget,
  onRoute,
}: {
  pois: Poi[]
  center: [number, number]
  navTarget?: Poi | null
  onRoute?: (info: RouteInfo | null, error?: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const originMarkerRef = useRef<any>(null)
  const poiMarkersRef = useRef<any[]>([])
  const walkingRef = useRef<any>(null)
  const poisRef = useRef<Poi[]>(pois)
  poisRef.current = pois
  const onRouteRef = useRef(onRoute)
  onRouteRef.current = onRoute

  /* 初始化地图（center 在挂载时已确定，只建一次） */
  useEffect(() => {
    if (!ref.current) return
    let alive = true
    ;(async () => {
      try {
        const map = await createMap(ref.current!, { center })
        if (!alive) {
          try {
            map.destroy?.()
          } catch {
            /* noop */
          }
          return
        }
        mapRef.current = map
        renderOriginMarker(map, center, originMarkerRef)
        renderPoiMarkers(map, poisRef.current, poiMarkersRef)
      } catch (err: any) {
        console.error('地图初始化失败：', err)
        onRouteRef.current?.(null, `地图初始化失败：${err?.message || err}`)
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
  }, [])

  /* POI 变化：只更新 POI 标记，不动原点与路线 */
  useEffect(() => {
    if (mapRef.current && (window as any).AMap) {
      renderPoiMarkers(mapRef.current, pois, poiMarkersRef)
    }
  }, [pois])

  /* 导航：从当前中心规划步行路线并画到地图 */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !(window as any).AMap) return
    let alive = true

    // 清掉上一条路线
    try {
      walkingRef.current?.clear?.()
    } catch {
      /* noop */
    }

    if (!navTarget?.lnglat) return

    const target = navTarget.lnglat
    ;(async () => {
      try {
        const Walking = await loadPlugin('AMap.Walking')
        if (!alive) return
        if (!walkingRef.current) {
          walkingRef.current = new Walking({ map, hideMarkers: true })
        }
        walkingRef.current.search(center, target, (status: string, result: any) => {
          if (!alive) return
          if (status !== 'complete') {
            onRouteRef.current?.(null, `路线规划失败：${status}`)
            return
          }
          const route = result?.routes?.[0]
          if (!route) {
            onRouteRef.current?.(null, '未找到可行路线')
            return
          }
          onRouteRef.current?.({
            distanceM: Math.round(route.distance || 0),
            minutes: Math.max(1, Math.round((route.time || 0) / 60)),
            steps: (route.steps || [])
              .map((s: any) => s.instruction)
              .filter((x: any) => typeof x === 'string' && x.trim()),
          })
          try {
            map.setFitView()
          } catch {
            /* noop */
          }
        })
      } catch (err: any) {
        if (alive) onRouteRef.current?.(null, err?.message || '导航失败')
      }
    })()

    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navTarget, center])

  return <div className="map-canvas" ref={ref} />
}

function renderOriginMarker(map: any, center: [number, number], ref: { current: any }) {
  try {
    const AMap = (window as any).AMap
    if (ref.current) map.remove(ref.current)
    const el = document.createElement('div')
    el.innerHTML =
      '<div style="width:18px;height:18px;border-radius:50%;background:#D64541;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.45)"></div>'
    ref.current = new AMap.Marker({ position: center, content: el, offset: new AMap.Pixel(-9, -9), title: '我的位置' })
    map.add(ref.current)
  } catch {
    /* noop */
  }
}

function renderPoiMarkers(map: any, pois: Poi[], ref: { current: any[] }) {
  try {
    const AMap = (window as any).AMap
    ref.current.forEach((m) => {
      try {
        map.remove(m)
      } catch {
        /* noop */
      }
    })
    ref.current = pois
      .filter((p) => p.lnglat)
      .map((p) => new AMap.Marker({ position: p.lnglat, title: p.name }))
    if (ref.current.length) map.add(ref.current)
  } catch {
    /* noop */
  }
}
