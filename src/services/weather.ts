// 环境监测服务：真实免费 API（Open-Meteo，免 Key、支持跨域）+ Mock 兜底
// 噪声、光照暂无免费稳定数据源，保持模拟；接口统一，后续可整体替换。

export interface EnvData {
  temperature: number // ℃
  humidity: number // %
  pm25: number // μg/m³
  noise: number // dB
  light: number // lx
  updatedAt: string
}

async function fetchJson(url: string, ms = 4000): Promise<any> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(String(res.status))
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function mockEnv(): EnvData {
  return {
    temperature: 24 + Math.round(Math.random() * 30) / 10,
    humidity: 46 + Math.round(Math.random() * 12),
    pm25: 26 + Math.round(Math.random() * 24),
    noise: 44 + Math.round(Math.random() * 16),
    light: 460 + Math.round(Math.random() * 180),
    updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
  }
}

/**
 * 获取座椅周边环境数据。
 * 正常 → Open-Meteo 真实天气/空气质量；失败/超时 → Mock 兜底。
 */
export async function getEnvironment(): Promise<EnvData> {
  const base = mockEnv()
  try {
    const [weather, air] = await Promise.all([
      fetchJson('https://api.open-meteo.com/v1/forecast?latitude=39.9&longitude=116.4&current=temperature_2m,relative_humidity_2m'),
      fetchJson('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=39.9&longitude=116.4&current=pm2_5'),
    ])
    return {
      ...base,
      temperature: weather?.current?.temperature_2m ?? base.temperature,
      humidity: weather?.current?.relative_humidity_2m ?? base.humidity,
      pm25: air?.current?.pm2_5 != null ? air.current.pm2_5 : base.pm25,
      updatedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    }
  } catch (err) {
    console.warn('环境数据获取失败，已降级为 Mock：', err)
    return base
  }
}
