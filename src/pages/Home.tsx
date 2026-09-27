import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Collapse } from 'antd'
import { ArrowUpRight } from 'lucide-react'
import HomeDeck, { deckGoTo } from '../components/HomeDeck'
import SiteFooter from '../components/SiteFooter'
import ProductArt from '../components/ProductArt'
import HeroGlow from '../components/HeroGlow'
import {
  MicIcon,
  AlertIcon,
  VideoIcon,
  CheckIcon,
  ArmchairIcon,
  LightIcon,
  HeartPulseIcon,
  PlugIcon,
} from '../components/icons'
import './home.css'

type IconComp = (props: { size?: number; color?: string; strokeWidth?: number }) => JSX.Element

interface Module {
  icon: IconComp
  name: string
  desc: string
  items: string[]
}

// —— 全部功能取自《功能.docx》——
const STATS = [
  { num: '60+', label: '面向 60 岁以上长者' },
  { num: '1 键', label: 'SOS 紧急呼救' },
  { num: '24h', label: '全天候值守' },
  { num: '8 类', label: '功能模块' },
]

const MODULES: Module[] = [
  {
    icon: ArmchairIcon,
    name: '座椅结构',
    desc: '双侧差异化长椅，右侧为老年人体工学设计。',
    items: ['左侧普通长椅', '右侧适老工学长椅', '扶手 · 靠背 · 两侧相连', '可加坐姿 / 久坐感知'],
  },
  {
    icon: CheckIcon,
    name: '适老设计',
    desc: '从坐、起、靠每个细节照顾长辈。',
    items: ['略高座面 · 略浅坐深', '高靠背 · 助起身扶手', '拐杖卡槽 · 可拆洗坐垫', '高对比边缘 · 低位照明'],
  },
  {
    icon: MicIcon,
    name: '交互模块',
    desc: '触控屏与语音双通道，长辈易上手。',
    items: ['触控屏', '语音播报', '大模型问答', '通话 · 视频通话', '位置检索', '紧急呼叫'],
  },
  {
    icon: AlertIcon,
    name: '安全应急',
    desc: '从呼救到安抚的完整闭环。',
    items: ['SOS 物理键 · 一键呼叫', 'AED 舱 · 灭火弹舱 · 急救包', '跌倒检测 · 异常行为识别', '自动报警 · 语音安抚'],
  },
  {
    icon: HeartPulseIcon,
    name: '健康关怀',
    desc: '非接触感知，不打扰地守护健康。',
    items: ['非接触心率 / 呼吸', '坐姿提醒', '毫米波雷达 + 视觉融合', '异常预警 · 授权共享'],
  },
  {
    icon: PlugIcon,
    name: '便民服务',
    desc: '把社区服务搬到家门口。',
    items: ['扫码充电', '共享充电宝 / 雨伞', 'WiFi · 5G', '信息发布', '环境监测', '座椅加热 / 通风'],
  },
  {
    icon: LightIcon,
    name: '照明能源',
    desc: '路灯与低位照明一体，绿色自供电。',
    items: ['路灯照明', '太阳能 + 储能', '低位照明', '人流 / 光照自适应调光'],
  },
  {
    icon: VideoIcon,
    name: '多杆联动',
    desc: '多根灯杆座椅互联互通。',
    items: ['屏端视频 / 语音通话', '显示使用中座位', '呼叫与聊天系统'],
  },
]

const AI_CAPS = [
  {
    n: '01',
    name: '语音与交互 AI',
    items: ['远场语音唤醒', '方言识别 · 慢语速 TTS', '大模型语音助手：查路线、查公交、问天气、聊健康、点戏曲', '长辈模式'],
  },
  {
    n: '02',
    name: '视觉与雷达感知 AI',
    items: ['毫米波雷达 + 摄像头融合', '跌倒检测 · 长时间不动报警', '异常行为识别 · 剧烈挥手呼救', '非接触心率 / 呼吸监测', '久坐 / 坐姿提醒'],
  },
  {
    n: '03',
    name: '应急与安全 AI',
    items: ['多模态交叉验证，降低误报', '自动定位', '自动拨打社区 / 家属 / 120', '语音安抚 · 现场信息同步推送', 'AED 开舱联动报警', 'SOS 通道独立，断网断电仍可用'],
  },
  {
    n: '04',
    name: '出行与便民 AI',
    items: ['公交到站提醒', '周边设施语音导航', '无障碍路径检索', '个性化内容推荐：养生、戏曲、新闻、社区公告', '环境数据联动'],
  },
  {
    n: '05',
    name: '环境与能源 AI',
    items: ['按光照、人流、噪声自动调屏亮度', '路灯功率自适应调光', '太阳能 + 储能 + 能耗优化', '座椅加热 / 通风智能控制'],
  },
  {
    n: '06',
    name: '适老 AI 专项',
    items: ['长辈模式：大字体、高对比、少层级、语音优先', '方言识别 · 慢语速 · 二次确认', '用药提醒 · 健康预警', '健康数据经授权共享给家属 / 医护人员'],
  },
]

const SIZE_TABLE = [
  ['座面高度', '430mm', '450mm（含坐垫）', '略高座面，起身省力'],
  ['坐深', '450mm', '420mm', '略浅坐深，腿短够得着'],
  ['靠背高（座面以上）', '400mm', '500mm', '高靠背，撑住腰背'],
  ['扶手', '标准扶手', '助起身扶手（加粗防滑）', '借力起身'],
  ['座面净宽', '560mm', '620mm', '更宽，可放拐杖坐垫'],
  ['高对比边缘', '无', '明黄 8–15mm', '看清边界（适老侧专属）'],
]

const SOS_FLOW = [
  { n: '1', title: '按下 SOS', desc: '座椅与灯杆上的红色物理键，一键触发' },
  { n: '2', title: '自动定位与呼叫', desc: '自动获取位置，呼叫家属、社区与 120' },
  { n: '3', title: '语音安抚', desc: '现场自动播放安抚语音，稳定情绪' },
  { n: '4', title: '信息同步推送', desc: '事件与位置实时推送家属与管理人员' },
  { n: '5', title: '回访确认', desc: '接通后语音回访，确认现场情况' },
]

const SCENES = [
  { name: '社区广场', desc: '日常休憩、邻里聊天、社区信息发布。' },
  { name: '公园绿地', desc: '散步歇脚、戏曲点播、低位照明夜行。' },
  { name: '公交站台', desc: '到站提醒、路线查询、应急充电。' },
  { name: '医院周边', desc: '无障碍导航、视频联络家属。' },
]

const FAQS = [
  { q: '适老化体现在哪里？', a: '结构适老（略高座面、助起身扶手、高靠背、拐杖卡槽）与界面适老（大字体、高对比、少层级、语音优先）双重设计。' },
  { q: '断网断电还能呼救吗？', a: 'SOS 采用独立通道设计，目标是在断网断电情况下仍可触发呼叫，这是产品的核心安全设计目标。' },
  { q: '健康数据与隐私如何保护？', a: '健康数据默认本地处理，仅在本人授权后共享给家属、监护人或医护人员，数据流向清晰可查。' },
  { q: '目前做到什么成熟度？', a: '结构设计（L1）＋ 可点击高保真原型（L2）＋ 可运行 Web Demo（L3），并持续迭代。' },
  { q: '如何运维与供电？', a: '采用太阳能 + 储能供电，模块化设计，日常维护成本低。' },
]

export default function Home() {
  return (
    <div className="home deck">
      <HomeDeck>
      {/* ===== Hero ===== */}
      <section className="deck-panel hero" id="top" data-label="首页">
        <HeroGlow />
        <div className="hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 0.8, 0.3, 1] }}
          >
            <span className="kicker">智慧公共设施 · 社区级 AI 微服务站</span>
            <h1 className="hero-title">
              <span className="hero-line">一张会照顾人的</span>
              <span className="hero-line accent">智慧座椅</span>
            </h1>
            <p className="hero-sub">
              以小型路灯杆为中轴、双侧差异化长椅为载体，融合适老结构、紧急救助、语音助手与便民服务，为社区长者提供 24 小时在身边的守护。
            </p>
            <div className="hero-actions">
              <Link to="/assistant" className="glass-pill">
                <span className="glass-pill-text">有什么可以帮您的？</span>
                <span className="glass-pill-arrow" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
              <a
                className="btn btn-ghost"
                href="#structure"
                onClick={(e) => {
                  e.preventDefault()
                  deckGoTo('structure')
                }}
              >
                查看产品结构
              </a>
            </div>
          </motion.div>
          <div className="hero-media">
            <ProductArt />
            <span className="hero-media-note">产品立面示意 · 渲染图由设计组提供</span>
          </div>
        </div>
        <div className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 为什么需要 ===== */}

        <section className="deck-panel band" id="background" data-label="为什么需要">
          <div className="section-head">
            <span className="section-kicker">为什么需要</span>
            <h2 className="section-title">
              当城市越来越快，
              <br />
              总要有人为慢下来的人留一把椅子
            </h2>
          </div>
          <div className="figures">
            <div className="figure">
              <span className="figure-num">2.97 亿</span>
              <p>
                60 岁及以上人口，约占全国 21.1%
                <em>国家统计局 2023</em>
              </p>
            </div>
            <div className="figure">
              <span className="figure-num">约 30%</span>
              <p>
                65 岁以上长者每年至少跌倒一次
                <em>WHO 公开数据</em>
              </p>
            </div>
            <div className="figure">
              <span className="figure-num">超 1 亿</span>
              <p>
                空巢与独居老人，日常缺乏照护
                <em>民政部公开口径</em>
              </p>
            </div>
          </div>
          <p className="section-note">* 数据为公开口径，答辩前请以你们查证的最新数据替换。</p>
        </section>

      {/* ===== 产品结构 ===== */}

        <section className="deck-panel section" id="structure" data-label="产品结构">
          <div className="section-head">
            <span className="section-kicker">产品结构</span>
            <h2 className="section-title">
              以灯杆为中轴，
              <br />
              一张椅子连接两侧需求
            </h2>
            <p className="section-lede">左侧普通长椅，右侧老年人体工学长椅，中间以触控屏与交互模块相连。</p>
          </div>
          <div className="structure">
            <div className="structure-media">
              <ProductArt />
            </div>
            <ul className="structure-list">
              <li>
                <strong>助起身扶手</strong>起坐借力，减少腰膝负担
              </li>
              <li>
                <strong>略高座面 · 略浅坐深</strong>更易坐下与起身
              </li>
              <li>
                <strong>高靠背 + 拐杖卡槽</strong>承托腰背，拐杖有处安放
              </li>
              <li>
                <strong>触控屏</strong>大字体、语音优先
              </li>
              <li>
                <strong>SOS 物理键</strong>断网断电仍可触发（设计目标）
              </li>
              <li>
                <strong>低位照明</strong>夜间脚下照明防绊倒
              </li>
            </ul>
          </div>
        </section>

      {/* ===== 适老化设计 ===== */}

        <section className="deck-panel section" id="design" data-label="适老化设计">
          <div className="section-head">
            <span className="section-kicker">适老化设计</span>
            <h2 className="section-title">
              为长辈而设计，
              <br />
              而不是为设计而设计
            </h2>
          </div>
          <div className="table-wrap">
            <table className="size-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>普通侧</th>
                  <th>适老侧</th>
                  <th>设计意图</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                    <td>{r[2]}</td>
                    <td>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="table-note">* 尺寸来自《外观建模指导》第四节，最终以设计组标注图为准。</p>
          </div>
        </section>

      {/* ===== 功能模块 ===== */}

        <section className="deck-panel section" id="features" data-label="功能模块">
          <div className="section-head">
            <span className="section-kicker">功能模块</span>
            <h2 className="section-title">8 大模块，覆盖长辈的每一天</h2>
          </div>
          <div className="module-grid">
            {MODULES.map((m) => (
              <div className="module-card" key={m.name}>
                <div className="module-head">
                  <m.icon size={22} />
                  <h3>{m.name}</h3>
                </div>
                <p className="module-desc">{m.desc}</p>
                <ul className="module-items">
                  {m.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      {/* ===== AI 能力 ===== */}

        <section className="deck-panel section" id="ai" data-label="AI 能力">
          <div className="section-head">
            <span className="section-kicker">AI 能力</span>
            <h2 className="section-title">六类 AI，让座椅真正会照顾人</h2>
          </div>
          <div className="ai-grid">
            {AI_CAPS.map((c) => (
              <div className="ai-card" key={c.n}>
                <span className="ai-num">{c.n}</span>
                <h3>{c.name}</h3>
                <ul>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

      {/* ===== 紧急呼叫 ===== */}

        <section className="deck-panel section" id="sos" data-label="紧急呼叫">
          <div className="section-head">
            <span className="section-kicker">紧急呼叫</span>
            <h2 className="section-title">一次呼救，五步闭环</h2>
          </div>
          <ol className="flow">
            {SOS_FLOW.map((s) => (
              <li key={s.n}>
                <span className="flow-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

      {/* ===== 部署场景 ===== */}

        <section className="deck-panel section" id="scenes" data-label="部署场景">
          <div className="section-head">
            <span className="section-kicker">部署场景</span>
            <h2 className="section-title">从社区到街头，处处可安放</h2>
          </div>
          <div className="scene-grid">
            {SCENES.map((s) => (
              <div className="scene-card" key={s.name}>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

      {/* ===== FAQ ===== */}

        <section className="deck-panel section" id="faq" data-label="常见问题">
          <div className="section-head">
            <span className="section-kicker">常见问题</span>
            <h2 className="section-title">你可能还想问</h2>
          </div>
          <Collapse
            ghost
            expandIconPlacement="end"
            items={FAQS.map((f, i) => ({
              key: String(i),
              label: f.q,
              children: <p className="faq-answer">{f.a}</p>,
            }))}
          />
        </section>

      {/* ===== 最后一屏：CTA 与页脚同屏相连，不再是「跳过去」的另一页 ===== */}
      <section className="deck-panel final" id="cta" data-label="开始体验">
        <div className="final-inner">
          <div className="cta">
            <h2>想看它实际怎么用？</h2>
            <p>打开在线 Demo，体验语音问答与紧急呼叫流程。</p>
            <Link to="/assistant" className="btn btn-primary btn-lg">
              进入语音助手
            </Link>
          </div>
        </div>
        <SiteFooter />
      </section>
      </HomeDeck>
    </div>
  )
}
