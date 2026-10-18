import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Search,
  Navigation,
  Hospital,
  Bus,
  Pill,
  Landmark,
  ShoppingCart,
  Accessibility,
} from 'lucide-react'
import { searchPOI, POI_TYPES, type Poi, type PoiType } from '../services/map'
import { getMapConfig, geolocate } from '../services/amap'
import { speak } from '../services/tts'
import { List, Tag } from 'antd'
import RealMap, { type RouteInfo } from '../components/RealMap'
import './map.css'

function poiIcon(type: string) {
  switch (type) {
    case '医院':
      return Hospital
    case '公交站':
      return Bus
    case '药店':
      return Pill
    case '银行':
      return Landmark
    case '超市':
      return ShoppingCart
    default:
      return Accessibility
  }
}

export default function Map() {
  const [type, setType] = useState<PoiType | '全部'>('全部')
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState<Poi[]>([])
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState<'amap' | 'mock'>('mock')
  const [error, setError] = useState('')
  const [center, setCenter] = useState<[number, number] | null>(null)
  const [geoSource, setGeoSource] = useState<'gps' | 'fallback' | null>(null)
  const [navTarget, setNavTarget] = useState<Poi | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [navError, setNavError] = useState('')
  const mapCfg = getMapConfig()

  const centerRef = useRef<[number, number] | null>(null)

  const runQuery = useCallback(async (kw: string, t: PoiType | '全部') => {
    setLoading(true)
    try {
      const res = await searchPOI(kw, t, centerRef.current ?? undefined)
      setList(res.pois)
      setSource(res.source)
      setError(res.error || '')
    } finally {
      setLoading(false)
    }
  }, [])

  /* 定位 + 首次检索 */
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (mapCfg.enabled) {
        const geo = await geolocate()
        if (!alive) return
        centerRef.current = geo.lnglat
        setCenter(geo.lnglat)
        setGeoSource(geo.source)
      }
      if (!alive) return
      runQuery('', '全部')
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* 切换类别时重新检索 */
  useEffect(() => {
    if (centerRef.current || !mapCfg.enabled) runQuery('', type)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const runSearch = () => runQuery(keyword, type)

  const announce = (p: Poi) => {
    speak(`${p.name}。距离您约 ${p.distanceM} 米，步行约 ${p.walkMinutes} 分钟。地址：${p.address}。${p.tag}。`)
  }

  const startNav = (p: Poi) => {
    if (!mapCfg.enabled || !p.lnglat) {
      announce(p)
      return
    }
    setNavTarget(p)
    setRouteInfo(null)
    setNavError('')
    announce(p)
  }

  const clearNav = () => {
    setNavTarget(null)
    setRouteInfo(null)
    setNavError('')
  }

  const handleRoute = (info: RouteInfo | null, err?: string) => {
    if (info) {
      setRouteInfo(info)
      setNavError('')
      speak(`已规划步行路线，全程约 ${info.distanceM} 米，步行约 ${info.minutes} 分钟。`)
    } else {
      setRouteInfo(null)
      if (err) setNavError(err)
    }
  }

  return (
    <div className="map">
      <div className="page-head">
        <span className="page-kicker">出行服务</span>
        <h2>位置检索</h2>
        <p className="page-sub">
          找医院、公交站、药店，一键步行导航
          <span className="page-note">
            （{source === 'amap'
              ? '高德实时数据'
              : mapCfg.enabled
                ? '预置示例数据'
                : 'Mock 模式：预置社区周边设施，接入高德后可查全城'}）
          </span>
        </p>
      </div>

      {error && (
        <p className="page-note" style={{ color: '#b42318' }}>
          真实检索失败：{error}（已显示预置数据，详细信息看浏览器 F12 Console）
        </p>
      )}

      <div className="map-layout">
        <section className="map-main">
          {mapCfg.enabled ? (
            center ? (
              <RealMap pois={list} center={center} navTarget={navTarget} onRoute={handleRoute} />
            ) : (
              <div className="map-board map-loading">
                <span className="map-loading-text">正在定位…</span>
              </div>
            )
          ) : (
            <div className="map-board" aria-hidden="true">
              <span className="map-pin pin-home">我的位置</span>
              <span className="map-pin pin-hospital">
                <Hospital size={16} /> 医院
              </span>
              <span className="map-pin pin-bus">
                <Bus size={16} /> 公交
              </span>
              <span className="map-pin pin-store">
                <ShoppingCart size={16} /> 超市
              </span>
              <span className="map-road r1" />
              <span className="map-road r2" />
            </div>
          )}

          {mapCfg.enabled && (
            <p className="map-geo-note">
              {geoSource === 'gps'
                ? '已定位到当前位置'
                : geoSource === 'fallback'
                  ? '定位失败，使用默认位置（北京）'
                  : '正在获取位置…'}
            </p>
          )}

          <div className="map-filters">
            <button className={`chip ${type === '全部' ? 'on' : ''}`} onClick={() => setType('全部')}>
              全部
            </button>
            {POI_TYPES.map((t) => (
              <button key={t} className={`chip ${type === t ? 'on' : ''}`} onClick={() => setType(t)}>
                {t}
              </button>
            ))}
          </div>

          <div className="map-search">
            <input
              className="input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runSearch()
              }}
              placeholder="搜索设施名称，例如：医院 / 药店 / 肯德基"
            />
            <button className="btn-primary-inline" onClick={runSearch} disabled={loading}>
              <Search size={18} />
              {loading ? '搜索中…' : '搜索'}
            </button>
          </div>

          {navTarget && (
            <div className="nav-banner">
              <span>
                <b>导航中：{navTarget.name}</b>
                {routeInfo
                  ? ` · 步行 ${routeInfo.distanceM} 米 · 约 ${routeInfo.minutes} 分钟`
                  : navError
                    ? ` · ${navError}`
                    : ' · 正在规划路线…'}
              </span>
              <button className="nav-clear" onClick={clearNav}>
                结束导航
              </button>
            </div>
          )}

          <List
            dataSource={list}
            locale={{ emptyText: '附近没有找到相关设施，换一个关键词试试。' }}
            renderItem={(p) => {
              const Icon = poiIcon(p.type)
              return (
                <List.Item
                  actions={[
                    <button key="nav" className="poi-speak" onClick={() => startNav(p)}>
                      <Navigation size={18} />
                      导航
                    </button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <span className="poi-icon">
                        <Icon size={22} />
                      </span>
                    }
                    title={
                      <span className="poi-name">
                        {p.name} <Tag color="green">{p.tag}</Tag>
                      </span>
                    }
                    description={
                      <span className="poi-desc">
                        {p.address} · 距离约 <b>{p.distanceM}</b> 米 · 步行约 <b>{p.walkMinutes}</b> 分钟
                      </span>
                    }
                  />
                </List.Item>
              )
            }}
          />
        </section>

        <aside className="map-side">
          <div className="panel">
            <h3 className="panel-title">无障碍出行</h3>
            <ul className="map-tips">
              <li>路线避开台阶与陡坡，优先无障碍通道</li>
              <li>所有结果支持一键语音播报</li>
              <li>点「导航」可在地图上规划步行路线</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
