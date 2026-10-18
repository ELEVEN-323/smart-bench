// 位置检索领域层：POI 类型、预置数据、检索编排（真实高德 + Mock 兜底）。
// 高德 SDK 的具体调用统一走 services/amap.ts。

import { getMapConfig, searchNearBy } from './amap'

export type PoiType = '医院' | '公交站' | '药店' | '银行' | '超市' | '公厕' | '其他'

export interface Poi {
  id: string
  name: string
  type: PoiType
  distanceM: number
  walkMinutes: number
  address: string
  tag: string
  /** 高德坐标 [经度, 纬度]，用于地图落点与导航 */
  lnglat?: [number, number]
}

export const POI_TYPES: PoiType[] = ['医院', '公交站', '药店', '银行', '超市', '公厕', '其他']

/** 首屏/兜底用的预置数据（北京中心附近示例）。 */
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

function amapTypeToPoiType(typeName: string): PoiType {
  const t = typeName || ''
  if (t.includes('医疗') || t.includes('医院') || t.includes('诊所')) return '医院'
  if (t.includes('药')) return '药店'
  if (t.includes('金融') || t.includes('银行')) return '银行'
  if (t.includes('购物') || t.includes('超市') || t.includes('便利店')) return '超市'
  if (t.includes('交通') || t.includes('公交') || t.includes('地铁')) return '公交站'
  if (t.includes('厕所') || t.includes('公共设施')) return '公厕'
  return '其他'
}

export interface PoiSearchResult {
  pois: Poi[]
  /** 数据来源：amap = 高德真实检索，mock = 预置数据 */
  source: 'amap' | 'mock'
  /** 真实检索失败时的原因（source=mock 且带 error 表示已降级） */
  error?: string
}

function filterMock(kw: string, type: PoiType | '全部'): Poi[] {
  return MOCK_POIS.filter((p) => {
    const matchType = type === '全部' || p.type === type
    const matchKw = !kw || p.name.includes(kw) || p.address.includes(kw) || p.tag.includes(kw)
    return matchType && matchKw
  })
}

/** 无关键词且「全部」时的默认检索词（助老最相关：先找医院）。 */
const DEFAULT_QUERY = '医院'

/**
 * 检索周边设施。
 * - 配置了高德 Key：以 center 为圆心真实检索，失败自动降级 Mock（带回错误原因）。
 * - 未配置：直接走预置数据。
 */
export async function searchPOI(
  keyword: string,
  type: PoiType | '全部',
  center?: [number, number],
): Promise<PoiSearchResult> {
  const cfg = getMapConfig()
  const kw = keyword.trim()
  const c = center || cfg.center
  const q = kw || (type === '全部' ? DEFAULT_QUERY : type)

  if (cfg.enabled) {
    try {
      const raw = await searchNearBy(q, c, 5000)
      const mapped: Poi[] = raw.map((p) => {
        const t = amapTypeToPoiType(p.type)
        return {
          id: p.id,
          name: p.name,
          type: t,
          distanceM: p.distanceM,
          walkMinutes: Math.max(1, Math.round(p.distanceM / 60)),
          address: p.address,
          tag: p.tel || p.type.split(';').pop() || '周边设施',
          lnglat: p.lnglat,
        }
      })
      return { pois: type === '全部' ? mapped : mapped.filter((p) => p.type === type), source: 'amap' }
    } catch (err: any) {
      console.warn('高德检索失败，降级 Mock：', err)
      return { pois: filterMock(kw, type), source: 'mock', error: err?.message || String(err) }
    }
  }

  return { pois: filterMock(kw, type), source: 'mock' }
}
