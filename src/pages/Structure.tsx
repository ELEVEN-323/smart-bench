import BenchArt from '../components/BenchArt'
import './structure.css'

/** 尺寸对比（与 docs/MODELING_GUIDE.md 第四节一致，单位 mm） */
const DIMS = [
  { item: '座面高', normal: '430', elder: '450（含坐垫）', note: '略高，起身省力' },
  { item: '坐深', normal: '450', elder: '420', note: '略浅，双脚踩实' },
  { item: '靠背高（座面以上）', normal: '400', elder: '500', note: '高靠背，撑住腰背' },
  { item: '座面净宽', normal: '560', elder: '620', note: '更宽，可放拐杖坐垫' },
]

const ELDER_PARTS = [
  ['助起身扶手', '略高、加粗、防滑纹，借力起身'],
  ['拐杖卡槽', '内径 40–50，挂杖不滑落'],
  ['可拆洗坐垫', '厚 20–40，方便清洗'],
  ['高对比边缘', '8–15mm 明黄条，看清边界'],
  ['低位照明', '座面下方 + 扶手导光条，夜间指引'],
  ['SOS 物理键', '扶手前端，红色，防误触环'],
]

export default function Structure() {
  return (
    <div className="structure">
      <div className="page-head">
        <h2>🪑 座椅 3D 展示</h2>
        <p className="page-sub">
          360° 查看结构细节
          <span className="page-note">（当前为线稿占位，设计组 .glb 模型到位后替换为可拖拽旋转的 3D 展示）</span>
        </p>
      </div>

      <div className="structure-layout">
        <section className="panel stage3d">
          <div className="stage3d-canvas">
            <BenchArt />
            <span className="stage3d-label">360° 展示 · 占位渲染</span>
          </div>
          <p className="stage3d-note">Three.js + @react-three/fiber 加载 .glb 后，支持拖拽旋转与缩放（规划中）。</p>
        </section>

        <aside className="structure-side">
          <section className="panel">
            <h3 className="panel-title">普通侧 vs 适老侧（mm）</h3>
            <table className="dim-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>普通侧</th>
                  <th className="elder-col">适老侧</th>
                </tr>
              </thead>
              <tbody>
                {DIMS.map((d) => (
                  <tr key={d.item}>
                    <td>{d.item}</td>
                    <td>{d.normal}</td>
                    <td className="elder-col">
                      <b>{d.elder}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="dim-note">三视图、爆炸图与渲染图由设计组交付，见《外观建模指导》。</p>
          </section>

          <section className="panel">
            <h3 className="panel-title">适老侧专属件</h3>
            <ul className="elder-parts">
              {ELDER_PARTS.map(([name, desc]) => (
                <li key={name}>
                  <b>{name}</b>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
