import { useEffect, useState } from 'react'
import BenchArt from './BenchArt'

const MODEL_URL = '/models/bench.glb'

/**
 * 3D 舞台：探测到 .glb 就按需加载 <model-viewer>，否则回退到线稿占位。
 * - model-viewer 走动态 import，不打进主包（首屏更快）
 * - 设计组把模型放到 public/models/bench.glb 后，无需改代码即自动切换为 3D
 */
export default function ModelStage() {
  const [hasModel, setHasModel] = useState(false)
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(MODEL_URL, { method: 'HEAD' })
        if (!res.ok) {
          if (alive) setHasModel(false)
          return
        }
        await import('@google/model-viewer')
        if (alive) setHasModel(true)
      } catch {
        if (alive) setHasModel(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  if (hasModel) {
    return (
      <model-viewer
        src={MODEL_URL}
        alt="智能助老座椅 3D 模型"
        auto-rotate={!reduce}
        camera-controls
        camera-target="-0.12 0.29 -0.12"
        camera-orbit="30deg 75deg 1.5m"
        rotation-per-second="30deg"
        shadow-intensity="1"
        style={{ width: '100%', height: '100%' }}
      />
    )
  }

  return (
    <div className="model-fallback">
      <BenchArt />
      <span className="model-fallback-note">
        等待 .glb 模型 — 放入 public/models/bench.glb 即自动切换为 3D
      </span>
    </div>
  )
}
