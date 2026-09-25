# 开发文档

> 面向**代码组队友**。只想部署上线？看 [README](../README.md)。
> 团队 Git 协作规范见 [GIT_WORKFLOW.md](./GIT_WORKFLOW.md)。

---

## 一、项目简介

**智能助老座椅** —— 面向老年群体的智慧公共座椅 / 智慧灯杆，融合适老化结构、紧急救助、健康关怀、便民服务与照明能源。

交付策略：聚焦「已有建模产出 + 高保真原型 + 可运行 Web Demo」三类可信佐证。需要真实硬件、传感器算法、医疗合规与线下运营的功能，统一降级为设计稿或二期规划。

---

## 二、本仓库范围（代码组）

| # | 交付物 | 形式 |
|---|--------|------|
| 1 | 可运行 Web Demo | 在线体验地址 |
| 2 | GitHub 代码仓库 | 就是本仓库 |
| 3 | README（部署指南） | 仓库文件 |
| 4 | 部署上线 | HTTPS 在线地址 |
| 5 | 代码演示录屏素材 | 视频片段 |

**不在本仓库范围**（设计组负责）：3D 建模、三视图 / 爆炸图 / 渲染图、材质色板、Figma 高保真原型、答辩 PPT 统筹。

---

## 三、技术栈

> ⚠️ 下表区分「已接入」与「规划中」，汇报时请按此口径，不要把规划中的当成已实现。

### ✅ 已接入（当前 `package.json` 实际依赖）

| 层次 | 技术 | 版本 |
|------|------|------|
| 构建 | Vite | 5.4 |
| 框架 | React | 18.3 |
| 语言 | TypeScript | 5.6 |
| 路由 | React Router | 6.30 |
| 样式 | 原生 CSS（设计 token 集中在 `src/index.css`） | — |
| 语音播报 | Web Speech API（浏览器原生，零依赖） | — |
| 大模型问答 | DeepSeek API（代码已写好，配置 Key 即启用） | — |

### 🟡 规划中（尚未安装依赖）

| 层次 | 技术 | 用途 |
|------|------|------|
| UI 组件 | Ant Design 5 | 适老化大字号组件 |
| 状态管理 | Zustand | 全局状态 |
| 3D 展示 | Three.js + @react-three/fiber | 加载设计组 `.glb` |
| 位置检索 | 高德地图 JS API 2.0 | 附近医院 / 公交 |
| 音视频通话 | PeerJS（WebRTC） | 视频通话 |
| 实时数据 | Supabase Realtime | 多杆联动 |

---

## 四、本地开发

### 前置条件

| 项 | 要求 | 说明 |
|----|------|------|
| Node.js | **22 或更高** | pnpm 11 要求 Node 22+ |
| pnpm | 11.x | 仓库锁文件为 `lockfileVersion: 9.0` |

### 启动

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（默认 Mock 模式，不配任何 Key 也能跑）
cp .env.example .env.local      # Windows: copy .env.example .env.local

# 3. 启动开发服务器
pnpm dev
```

打开 http://localhost:5173

### 其他命令

```bash
pnpm build      # 类型检查 + 生产构建，输出到 dist/
pnpm preview    # 本地预览构建产物，默认 http://localhost:4173
```

### 环境变量

| 变量 | 用途 | 默认 |
|------|------|------|
| `VITE_USE_MOCK` | 全局 Mock 开关，`true` = 全用假数据 | `true` |
| `VITE_LLM_API_KEY` | DeepSeek API 密钥 | 空 |
| `VITE_LLM_BASE_URL` | DeepSeek API 地址 | `https://api.deepseek.com` |
| `VITE_AMAP_KEY` | 高德地图 JS API 密钥 | 空 |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase 实时数据库 | 空 |

> 🔒 `.env.local` 已在 `.gitignore` 中，**绝不提交**。
> ⚠️ `VITE_*` 变量会被打包进前端 JS，浏览器可直接查看，**不要放高额度密钥**。

### 关于构建脚本审批（重要）

`pnpm-workspace.yaml` 里的配置**不要删**：

```yaml
allowBuilds:
  esbuild: true
```

`esbuild` 是 Vite 的构建依赖，需要执行 `postinstall`。pnpm 11 的 `strictDepBuilds` 默认为 `true`，若未显式允许，**任何 pnpm 命令都会直接报错**：

```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.21.5
```

> 注：pnpm 11 用 `allowBuilds`（映射表）取代了旧版的 `onlyBuiltDependencies` 列表。

---

## 五、目录结构

```
smart-bench/
├─ src/
│  ├─ components/          # 通用组件
│  │  ├─ Logo.tsx          # SVG 品牌标识
│  │  ├─ icons.tsx         # 统一图标
│  │  ├─ Reveal.tsx        # 滚动进入视口时淡入揭示
│  │  ├─ HeroShapes.tsx    # 主视觉漂浮色块（纯装饰）
│  │  └─ BenchArt.tsx      # ⭐ 座椅线稿占位（渲染图到位后替换）
│  ├─ pages/               # 页面（每个页面配一个同名 .css）
│  │  ├─ Home.tsx          # 首页总览
│  │  └─ Assistant.tsx     # 语音助手
│  ├─ services/            # ⭐ 服务封装层（Mock 优先）
│  │  ├─ llm.ts            # 大模型：真实 API → 出错/未配置 → Mock 兜底
│  │  └─ tts.ts            # 语音播报：Web Speech API
│  ├─ mock/
│  │  └─ answers.ts        # 预置问答（正则匹配）
│  ├─ App.tsx              # 顶栏 + 路由 + 页脚
│  ├─ main.tsx             # 入口
│  └─ index.css            # 全局样式 + 设计 token
├─ docs/
│  ├─ TECH_PLAN.md         # 技术方案（范围 / 架构 / 排期 / 风险）
│  ├─ GIT_WORKFLOW.md      # 团队协作规范
│  └─ DEVELOPMENT.md       # 本文件
├─ vercel.json             # Vercel 部署配置（SPA 路由回退）
├─ edgeone.json            # EdgeOne Pages 部署配置
├─ pnpm-workspace.yaml     # ⚠️ 构建脚本审批，勿删
├─ .env.example            # 密钥模板
└─ README.md               # 部署指南（面向使用者）
```

---

## 六、两个核心约定

### ① Mock 优先 —— 保证演示永不失败 ⭐

所有外部能力统一走 `services/` 封装层，**默认走假数据**，配了 Key 才走真实 API：

```
正常            → 调真实 API
没 Key / 限流 / 报错 / 断网 → 自动降级为 Mock
```

新增外部服务时请沿用这个范式，见 `src/services/llm.ts`。

### ② 占位优先 —— 不被设计物料阻塞

图片、模型、文案通过配置文件集中管理，物料没到位就用占位资源，到位后一处替换。

---

## 七、适老化 UI 规范

| 项目 | 规范 |
|------|------|
| 字号 | 正文 ≥ 20px，标题 ≥ 32px |
| 按钮 | 高度 ≥ 64px，大圆角，强对比 |
| 配色 | 高对比度（当前：陶土橙 `#b95a35` + 暖纸白 `#f6f3ee`） |
| 交互 | 大热区、少层级、语音 + 文字双通道 |

配色 token 定义在 `src/index.css` 的 `:root`，设计组规范到位后在此统一替换。

---

## 八、功能规划

> 📌 完整功能定义（产品功能 8 大模块 + AI 赋能 6 组能力，含状态标注）以 [FEATURES.md](./FEATURES.md) 为准，本节只列优先级与进度。

### ✅ P0 —— 可运行

| 模块 | 状态 |
|------|------|
| 首页总览 | ✅ 已完成 |
| 语音播报 | ✅ 已完成 |
| 大模型问答 | ✅ 已完成（Mock 模式） |
| 座椅 3D 展示 | ⬜ 待开发 |
| 紧急呼叫 SOS | ⬜ 待开发 |
| 视频通话 | ⬜ 待开发 |
| 位置检索 | ⬜ 待开发 |
| 信息发布 | ⬜ 待开发 |
| 座位状态（多杆联动） | ⬜ 待开发 |

### 🟡 P1 —— 模拟实现

SOS 物理键按压动画 · 久坐提醒 · 扫码充电 · AED 舱开舱动效 · 自动报警流程 · 环境监测 · 自适应调光滑块 · 隐私授权页面

### ⏸ P2 —— 二期规划（不写代码）

跌倒检测 · 异常行为识别 · 非接触心率呼吸 · 雷达视觉融合 · 共享充电宝 / 雨伞 · WiFi / 5G · 座椅加热通风 · 驱蚊

---

## 九、参与开发

1. 阅读 [团队 Git 协作指南](./GIT_WORKFLOW.md)
2. 从 `dev` 拉功能分支开发
3. 提交 Pull Request（目标分支选 `dev`）

> 🚫 **不要直接推 `main`**，`main` 只保留可演示的稳定版本。

---

## 十、文档索引

| 文档 | 说明 |
|------|------|
| [README](../README.md) | 部署指南（面向使用者 / 评委） |
| [FEATURES.md](./FEATURES.md) | ⭐ 功能定义总览：8 大模块 + 6 组 AI 能力，唯一权威清单 |
| [TECH_PLAN.md](./TECH_PLAN.md) | 职责边界、架构、选型、模块拆解、排期、风险预案 |
| [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) | 分支策略、日常流程、Commit 规范、常见问题 |
