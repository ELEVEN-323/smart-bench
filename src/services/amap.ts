// 高德 JS API 2.0 统一封装：配置读取 + 脚本/插件加载 + 定位/检索/路线。
// 全站唯一入口：脚本只加载一次、插件按需缓存，避免重复加载与竞态。

export interface MapConfig {
  enabled: boolean
  key: string
  securityCode: string
  center: [number, number]
  style: string
}

export function getMapConfig(): MapConfig {
  const key = import.meta.env.VITE_AMAP_KEY as string | undefined
  const securityCode = import.meta.env.VITE_AMAP_SECURITY as string | undefined
  const centerStr = (import.meta.env.VITE_AMAP_CENTER as string | undefined) || '116.397428,39.90923'
  const [lng, lat] = centerStr.split(',').map((s) => Number(s.trim()))
  const center: [number, number] = [
    Number.isFinite(lng) ? lng : 116.397428,
    Number.isFinite(lat) ? lat : 39.90923,
  ]
  return {
    enabled: Boolean(key),
    key: key || '',
    securityCode: securityCode || '',
    center,
    style: (import.meta.env.VITE_AMAP_STYLE as string | undefined) || 'amap://styles/macaron',
  }
}

let amapLoadPromise: Promise<any> | null = null
const pluginCache = new Map<string, Promise<any>>()

/** 加载高德 JS API 脚本（只加载一次，安全密钥在脚本加载前写入）。 */
export function loadAMap(): Promise<any> {
  const cfg = getMapConfig()
  if (!cfg.enabled) return Promise.reject(new Error('未配置高德 Key'))
  const w = window as any
  if (w.AMap) return Promise.resolve(w.AMap)
  if (amapLoadPromise) return amapLoadPromise

  amapLoadPromise = new Promise<any>((resolve, reject) => {
    if (cfg.securityCode) w._AMapSecurityConfig = { securityJsCode: cfg.securityCode }

    const existing = document.querySelector<HTMLScriptElement>('script[src*="webapi.amap.com/maps"]')
    if (existing) {
      // 已有脚本在加载（可能由其它代码插入），轮询等待其完成
      const timer = window.setInterval(() => {
        if (w.AMap) {
          window.clearInterval(timer)
          resolve(w.AMap)
        }
      }, 100)
      existing.addEventListener('error', () => {
        window.clearInterval(timer)
        reject(new Error('高德地图脚本加载失败'))
      })
      window.setTimeout(() => {
        window.clearInterval(timer)
        w.AMap ? resolve(w.AMap) : reject(new Error('高德地图加载超时'))
      }, 20000)
      return
    }

    const s = document.createElement('script')
    s.src = `https://webapi.amap.com/maps?v=2.0&key=${cfg.key}`
    s.async = true
    s.onload = () => resolve(w.AMap)
    s.onerror = () => reject(new Error('高德地图脚本加载失败'))
    document.head.appendChild(s)
  })
  return amapLoadPromise
}

/** 加载指定插件（按需缓存），返回插件类，例如 loadPlugin('AMap.PlaceSearch') -> AMap.PlaceSearch。 */
export function loadPlugin(name: string): Promise<any> {
  return loadAMap().then((AMap) => {
    const cls = name.replace('AMap.', '')
    if (AMap?.[cls]) return AMap[cls]
    if (!pluginCache.has(name)) {
      pluginCache.set(
        name,
        new Promise<any>((resolve, reject) => {
          if (typeof AMap.plugin !== 'function') {
            pluginCache.delete(name)
            reject(new Error('AMap.plugin 不可用'))
            return
          }
          const timer = window.setTimeout(() => {
            pluginCache.delete(name)
            reject(new Error(`${name} 加载超时`))
          }, 10000)
          AMap.plugin(name, () => {
            window.clearTimeout(timer)
            resolve(AMap[cls])
          })
        }),
      )
    }
    return pluginCache.get(name)!
  })
}

/** 创建地图实例。 */
export async function createMap(container: HTMLElement, opts: Record<string, any> = {}): Promise<any> {
  const AMap = await loadAMap()
  const cfg = getMapConfig()
  return new AMap.Map(container, {
    zoom: 15,
    center: cfg.center,
    viewMode: '2D',
    mapStyle: cfg.style,
    ...opts,
  })
}

export interface GeoResult {
  /** 高德坐标（GCJ-02） */
  lnglat: [number, number]
  source: 'gps' | 'fallback'
}

/** 浏览器定位，返回高德坐标；失败/拒绝则回退到配置中心。 */
export async function geolocate(): Promise<GeoResult> {
  const cfg = getMapConfig()
  try {
    const Geolocation = await loadPlugin('AMap.Geolocation')
    const geo = new Geolocation({ enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 })
    const pos = await new Promise<any>((resolve) => {
      geo.getCurrentPosition((status: string, result: any) => {
        resolve(status === 'complete' && result?.position ? result.position : null)
      })
    })
    if (pos?.lng != null && pos?.lat != null) {
      return { lnglat: [pos.lng, pos.lat], source: 'gps' }
    }
  } catch (err) {
    console.warn('定位失败，回退默认中心：', err)
  }
  return { lnglat: cfg.center, source: 'fallback' }
}

export interface AmapPoi {
  id: string
  name: string
  type: string
  address: string
  lnglat: [number, number]
  distanceM: number
  tel?: string
}

/** 周边搜索。 */
export async function searchNearBy(keyword: string, center: [number, number], radius = 5000): Promise<AmapPoi[]> {
  const PlaceSearch = await loadPlugin('AMap.PlaceSearch')
  const service = new PlaceSearch({ pageSize: 12, pageIndex: 1, extensions: 'all' })
  const result = await new Promise<any>((resolve, reject) => {
    service.searchNearBy(keyword, center, radius, (status: string, res: any) => {
      if (status === 'complete') resolve(res)
      else if (status === 'no_data') resolve({ poiList: { pois: [] } })
      else reject(new Error(`检索状态：${status}`))
    })
  })
  const raw = result?.poiList?.pois ?? []
  return raw
    .filter((p: any) => p.location?.lng != null && p.location?.lat != null)
    .map((p: any) => ({
      id: String(p.id ?? `${p.location.lng},${p.location.lat}`),
      name: p.name || '未命名地点',
      type: p.type || '',
      address: p.address || [p.pname, p.cityname, p.adname].filter(Boolean).join('') || '地址未提供',
      lnglat: [p.location.lng, p.location.lat] as [number, number],
      distanceM: typeof p.distance === 'number' ? Math.round(p.distance) : 0,
      tel: p.tel ? String(p.tel).split(';')[0] : undefined,
    }))
}


