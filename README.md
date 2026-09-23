# 智能助老座椅 · smart-bench

> 面向老年群体的**智慧公共座椅 / 智慧灯杆** —— 适老化结构 + 紧急救助 + 健康关怀 + 便民服务 + 照明能源

[![Repo](https://img.shields.io/badge/GitHub-smart--bench-blue)](https://github.com/ELEVEN-323/smart-bench)

---

## 📖 项目简介

本项目面向老龄化社会下的公共空间痛点，设计一套集**座椅结构、交互终端、安全应急、健康关怀、便民服务、照明能源、多杆联动**于一体的智慧公共设施。

**交付策略**：10 天内聚焦「已有建模产出 + 高保真原型 + 可运行 Web Demo」三类可信佐证。需要真实硬件、传感器算法、医疗合规与线下运营的功能，统一降级为设计稿或二期规划。

---

## 🎯 本仓库范围（代码组）

本仓库由**代码组**维护，负责以下交付物：

| # | 交付物 | 形式 |
|---|--------|------|
| 1 | **可运行 Web Demo** | 在线体验地址 |
| 2 | **GitHub 代码仓库** | 就是本仓库 |
| 3 | **README**（架构图 + 截图 + 运行指南） | 仓库文件 |
| 4 | **部署上线** | HTTPS 在线地址 |
| 5 | 代码演示录屏素材 | 视频片段 |
| 6 | 可选：PWA 安装包 | Release 附件 |

**不在本仓库范围**（由设计组负责）：3D 建模、三视图/爆炸图/渲染图、材质色板、Figma 高保真原型、答辩 PPT 统筹。

---

## 🛠 技术栈

| 层次 | 技术 |
|------|------|
| 前端框架 | Vite + React + TypeScript |
| UI 组件 | Ant Design 5（适老化大字号改造） |
| 状态管理 | Zustand |
| 3D 展示 | Three.js + @react-three/fiber |
| 语音播报 | Web Speech API |
| 大模型问答 | DeepSeek API |
| 位置检索 | 高德地图 JS API |
| 音视频通话 | WebRTC（PeerJS） |
| 实时数据 | Supabase Realtime |
| 部署 | Vercel / EdgeOne Pages |

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [**技术方案**](docs/TECH_PLAN.md) | 职责边界、架构、选型、模块拆解、排期、风险预案 |
| [**团队 Git 协作指南**](docs/GIT_WORKFLOW.md) | 分支策略、日常流程、Commit 规范、常见问题 |

---

## 🚀 快速开始

> ⏳ 脚手架将于 **D5** 阶段搭建，届时此处补充运行说明。

```bash
# 1. 克隆仓库
git clone git@github.com:ELEVEN-323/smart-bench.git
cd smart-bench

# 2. 安装依赖
pnpm install

# 3. 配置环境变量（复制模板后填入自己的 Key）
cp .env.example .env.local

# 4. 启动开发服务器
pnpm dev
```

### 环境变量说明

| 变量 | 用途 |
|------|------|
| `VITE_USE_MOCK` | 全局 Mock 开关，`true` = 全用假数据（演示永不失败） |
| `VITE_LLM_API_KEY` | DeepSeek API 密钥 |
| `VITE_AMAP_KEY` | 高德地图 JS API 密钥 |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase 实时数据库 |

> 🔒 **`.env.local` 已在 `.gitignore` 中，绝不会被提交。**

---

## ✨ 功能规划

### ✅ P0 —— 可运行
首页总览 · 座椅 3D 展示 · 语音播报 · 大模型问答 · 紧急呼叫 SOS · 视频通话 · 位置检索 · 信息发布 · 座位状态（多杆联动）

### 🟡 P1 —— 模拟实现
SOS 物理键 · 久坐提醒 · 扫码充电 · AED 舱 · 自动报警 · 环境监测 · 自适应调光 · 隐私授权

### ⏸ P2 —— 二期规划（不写代码）
跌倒检测 · 异常行为识别 · 非接触心率呼吸 · 雷达视觉融合 · 共享充电宝 · WiFi/5G · 座椅加热通风 · 驱蚊

---

## 👥 参与开发

1. 阅读 [团队 Git 协作指南](docs/GIT_WORKFLOW.md)
2. 配置 SSH 密钥与 Git 身份
3. 从 `dev` 拉功能分支开发
4. 提交 Pull Request（目标分支选 `dev`）

> 🚫 **不要直接推 `main`**，`main` 只保留可演示的稳定版本。

---

## 📄 许可

本项目为参赛作品，保留所有权利。
