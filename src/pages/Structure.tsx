import ModelStage from '../components/ModelStage'
import { Table, Descriptions } from 'antd'
import './structure.css'

// —— 尺寸与结构均来自《外观建模指导》(MODELING_GUIDE.md) ——
const STEPS = [
  {
    index: '01',
    title: '坐下，更省力',
    desc: '适老侧座面略高、略浅：430mm 提到 450mm（含坐垫），坐深 450mm 收到 420mm。',
    points: ['座面略高，减少起身时膝关节与腰背负担', '坐深略浅，双脚踩实，起身有底'],
  },
  {
    index: '02',
    title: '起身，有处借力',
    desc: '助起身扶手略高、加粗、带防滑纹，起坐时一扶即起。',
    points: ['扶手顶高约 690mm，借力更顺手', '加粗握持 + 防滑纹，雨天也不打滑'],
  },
  {
    index: '03',
    title: '久坐，靠得住',
    desc: '高靠背从 400mm 升到 500mm，撑住腰背；可拆洗坐垫厚 20–40mm。',
    points: ['高靠背承托腰背与头颈', '可拆洗坐垫，方便清洗'],
  },
  {
    index: '04',
    title: '夜间，也安心',
    desc: 'SOS 红色物理键、低位照明、明黄高对比边缘，看不见也摸得着。',
    points: ['SOS 键在扶手前端，红色 + 防误触环', '低位照明 + 明黄边缘条，夜间辨位'],
  },
]

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
    <div className="structure-story">
      <header className="story-head">
        <span className="story-kicker">产品结构</span>
        <h2 className="story-title">一台设备，两半不同的长椅</h2>
        <p className="story-lede">
          以小型路灯杆为中轴（总高 4m），左侧普通长椅、右侧老年人体工学长椅；触控屏中心高 1200mm，座面区总长 1460mm。
        </p>
      </header>

      <div className="story">
        <div className="story-visual">
          <div className="story-canvas">
            <ModelStage />
            <span className="story-canvas-caption">360° 展示 · 拖拽旋转</span>
          </div>
        </div>

        <div className="story-copy">
          {STEPS.map((s) => (
            <section className="story-step" key={s.index}>
              <span className="story-step-index">{s.index}</span>
              <h3 className="story-step-title">{s.title}</h3>
              <p className="story-step-desc">{s.desc}</p>
              <ul className="story-step-points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <section className="story-block">
        <h3 className="story-block-title">普通侧 vs 适老侧（mm）</h3>
        <Table
          rowKey="item"
          pagination={false}
          size="middle"
          columns={[
            { title: '项目', dataIndex: 'item' },
            { title: '普通侧', dataIndex: 'normal' },
            { title: '适老侧', dataIndex: 'elderNode' },
            { title: '设计意图', dataIndex: 'note' },
          ]}
          dataSource={DIMS.map((d) => ({ ...d, elderNode: <b className="elder-col">{d.elder}</b> }))}
        />
        <p className="table-note">
          * 尺寸来自《外观建模指导》第四节；硬约束：杆体总高 4000、屏幕中心 1200、座面区总长 1460。
        </p>
      </section>

      <section className="story-block">
        <h3 className="story-block-title">适老侧专属件</h3>
        <Descriptions
          bordered
          size="middle"
          column={2}
          items={ELDER_PARTS.map(([name, desc]) => ({
            key: name,
            label: name,
            children: desc,
          }))}
        />
      </section>
    </div>
  )
}
