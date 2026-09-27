import { useCallback, useEffect, useState } from 'react'
import {
  Search,
  Volume2,
  Hospital,
  Bus,
  Pill,
  Landmark,
  ShoppingCart,
  Accessibility,
} from 'lucide-react'
import { searchPOI, POI_TYPES, getMapConfig, type Poi, type PoiType } from '../services/map'
import { speak } from '../services/tts'
import { List, Tag } from 'antd'
import RealMap from '../components/RealMap'
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
  const mapCfg = getMapConfig()

  const refresh = useCallback(async () => {
    setLoading(true)
    const res = await searchPOI(keyword, type)
    setList(res)
    setLoading(false)
  }, [keyword, type])

  useEffect(() => {
    refresh()
  }, [refresh])

  const announce = (p: Poi) => {
    speak(`${p.name}。距离您约 ${p.distanceM} 米，步行约 ${p.walkMinutes} 分钟。地址：${p.address}。${p.tag}。`)
  }

  return (
    <div className="map">
      <div className="page-head">
        <span className="page-kicker">出行服务</span>
        <h2>位置检索</h2>
        <p className="page-sub">
          找医院、公交站、药店，一键语音导航
          <span className="page-note">（{mapCfg.enabled ? '已接入高德地图' : 'Mock 模式：预置社区周边设施，接入高德后可查全城'}）</span>
        </p>
      </div>

      <div className="map-layout">
        <section className="map-main">
          {mapCfg.enabled ? (
            <RealMap pois={list} />
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
              placeholder="搜索设施名称或地址，例如：医院"
            />
            <button className="btn-primary-inline" onClick={refresh} disabled={loading}>
              <Search size={18} />
              {loading ? '搜索中…' : '搜索'}
            </button>
          </div>

          <List
            dataSource={list}
            locale={{ emptyText: '附近没有找到相关设施，换一个类别试试。' }}
            renderItem={(p) => {
              const Icon = poiIcon(p.type)
              return (
                <List.Item
                  actions={[
                    <button key="speak" className="poi-speak" onClick={() => announce(p)}>
                      <Volume2 size={18} />
                      语音导航
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
              <li>长按地点可呼叫家人陪同</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
