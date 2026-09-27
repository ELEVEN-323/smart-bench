// 位置检索服务：Mock 优先
// 真实接入（高德 JS API 2.0）需在 index.html 引入 Loader 并配置 securityJsCode，
// 属于后续工作；页面只依赖本接口，届时替换实现即可，页面无感。

export type PoiType = '医院' | '公交站' | '药店' | '银行' | '超市' | '公厕'

export interface Poi {
  id: string
  name: string
  type: PoiType
  distanceM: number
  walkMinutes: number
  address: string
  tag: string
  /** 经纬度 [经度, 纬度]，用于高德地图落点；Mock 数据给的是默认中心附近的近似坐标 */
  lnglat?: [number, number]
}

export interface MapConfig {
  enabled: boolean
  key: string
  securityCode: string
  center: [number, number]
}

/**
 * 读取高德地图配置。没填 VITE_AMAP_KEY 时 enabled=false，页面自动回退到 CSS 模拟图。
 */
export function getMapConfig(): MapConfig {
  const key = import.meta.env.VITE_AMAP_KEY as string | undefined
  const securityCode = import.meta.env.VITE_AMAP_SECURITY as string | undefined
  const centerStr: string = (import.meta.env.VITE_AMAP_CENTER as string | undefined) || '116.397428,39.90923'
  const [lng, lat] = centerStr.split(',').map((s) => Number(s.trim()))
  const center: [number, number] = [
    Number.isFinite(lng) ? lng : 116.397428,
    Number.isFinite(lat) ? lat : 39.90923,
  ]
  return { enabled: Boolean(key), key: key || '', securityCode: securityCode || '', center }
}

export const POI_TYPES: PoiType[] = ['医院', '公交站', '药店', '银行', '超市', '公厕']

const MOCK_POIS: Poi[] = [
  { id: 'p01', name: '春晖社区卫生服务中心', type: '医院', distanceM: 450, walkMinutes: 6, address: '春晖路 12 号', tag: '全科门诊 · 24 小时', lnglat: [116.3968, 39.9105] },
  { id: 'p02', name: '市第一人民医院（东院）', type: '医院', distanceM: 2100, walkMinutes: 28, address: '人民大道 88 号', tag: '三甲 · 急诊', lnglat: [116.4108, 39.9166] },
  { id: 'p03', name: '春晖路公交站', type: '公交站', distanceM: 120, walkMinutes: 2, address: '春晖路与迎宾街交叉口', tag: '12 路 · 25 路 · 302 路', lnglat: [116.3984, 39.9082] },
  { id: 'p04', name: '迎宾街地铁站 B 口', type: '公交站', distanceM: 600, walkMinutes: 8, address: '迎宾街 66 号', tag: '2 号线', lnglat: [116.4032, 39.9124] },
  { id: 'p05', name: '康乐大药房（春晖店）', type: '药店', distanceM: 300, walkMinutes: 4, address: '春晖路 5 号', tag: '医保定点', lnglat: [116.3962, 39.9088] },
  { id: 'p06', name: '百姓大药房（24h）', type: '药店', distanceM: 850, walkMinutes: 11, address: '迎宾街 101 号', tag: '24 小时营业', lnglat: [116.4048, 39.9152] },
  { id: 'p07', name: '农商银行春晖支行', type: '银行', distanceM: 520, walkMinutes: 7, address: '春晖路 28 号', tag: 'ATM 24h', lnglat: [116.3992, 39.9101] },
  { id: 'p08', name: '好邻里生活超市', type: '超市', distanceM: 400, walkMinutes: 5, address: '春晖路 16 号', tag: '无障碍通道', lnglat: [116.3959, 39.9094] },
  { id: 'p09', name: '春晖公园公共卫生间', type: '公厕', distanceM: 350, walkMinutes: 5, address: '春晖公园南门', tag: '无障碍卫生间', lnglat: [116.3989, 39.9069] },
]

/**
 * 检索周边设施。真实 API 未配置时自动走 Mock，保证演示永不失败。
 */
export async function searchPOI(keyword: string, type: PoiType | '全部'): Promise<Poi[]> {
  // 模拟真实检索的网络延迟，让交互更可信
  await new Promise((r) => setTimeout(r, 240))
  const kw = keyword.trim()
  return MOCK_POIS.filter((p) => {
    const matchType = type === '全部' || p.type === type
    const matchKw = !kw || p.name.includes(kw) || p.address.includes(kw) || p.tag.includes(kw)
    return matchType && matchKw
  })
}

/**
 * 真实接入规划（未启用）：高德 JS API 2.0
 * - index.html 引入 <script src="https://webapi.amap.com/maps?v=2.0&key=..."></script>
 * - 使用 AMap.PlaceSearch 周边搜索，结果映射为 Poi 结构
 * - 失败时降级回本 Mock，接口不变
 */
