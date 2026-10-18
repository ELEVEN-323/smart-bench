# 智能助老座椅 · smart-bench

> 面向老年群体的智慧公共座椅与智慧灯杆，一台社区级 AI 微服务站。

[![Live Demo](https://img.shields.io/badge/Live%20Demo-EdgeOne-brightgreen)](https://smart-bench-bdlywswb.edgeone.cool)
[![Stack](https://img.shields.io/badge/stack-Vite%20%7C%20React%20%7C%20TypeScript-646CFF)](https://vitejs.dev)
[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-lightgrey)](LICENSE)

## 简介

一台以小型路灯杆为中轴、双侧差异化长椅为载体的社区级 AI 微服务站。左侧为普通长椅，右侧为老年人人体工学长椅；杆体集成触控屏、语音助手、紧急呼叫、AED 与便民舱。

本仓库是该产品的 Web 演示系统，可部署为纯静态站点，通过浏览器直接访问，无需服务器与数据库。

所有外部能力（大模型、地图、实时数据）默认走内置 Mock 数据，不配置任何密钥也能完整演示。

## 在线体验

https://smart-bench-bdlywswb.edgeone.cool

## 功能

| 页面 | 说明 |
|------|------|
| 首页总览 | 产品介绍、功能模块、AI 能力与结构叙事 |
| 语音助手 | 大模型问答与语音播报，支持 Mock 兜底 |
| 紧急呼叫 | 待机 → 呼叫 → 接通 → 安抚状态机，超时自动升级 |
| 位置检索 | 高德地图定位、周边检索与步行导航 |
| 照明能源 | 实时环境数据与自适应调光模拟 |
| 扫码充电 | 扫码、计时与费用模拟 |
| 信息发布 | 管理端发布，屏端实时显示 |
| 隐私授权 | 数据流向图与授权开关 |
| 视频通话 | PeerJS 点对点视频通话 |
| 多杆联动 | 座位状态跨窗口实时同步 |
| 3D 展示 | 产品模型 360° 旋转展示 |

## 技术栈

- **构建**：Vite
- **框架**：React + TypeScript
- **路由**：React Router（Hash 模式）
- **UI**：Ant Design
- **3D**：`<model-viewer>`
- **外部服务**：DeepSeek、高德地图、Open-Meteo、PeerJS、Supabase（均为可选，未配置时自动降级为 Mock）

## 快速开始

环境要求：Node.js 18.12+，pnpm 10.x。

```bash
git clone https://github.com/ELEVEN-323/smart-bench.git
cd smart-bench
pnpm install
pnpm dev
```

打开 http://localhost:5173。

构建与本地预览：

```bash
pnpm build
pnpm preview
```

## 环境变量

不配置任何变量也能完整演示。需要接入真实能力时，将 `.env.example` 复制为 `.env.local` 并填写：

| 变量 | 说明 |
|------|------|
| `VITE_USE_MOCK` | 全局 Mock 开关，默认 `true` |
| `VITE_LLM_API_KEY` | DeepSeek API 密钥 |
| `VITE_AMAP_KEY` / `VITE_AMAP_SECURITY` | 高德地图 JS API 密钥与安全密钥 |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | Supabase 项目地址与匿名密钥（多杆联动） |

`VITE_` 前缀的变量会被打包进前端产物，请使用设置有额度上限的密钥。

## 项目结构

```
smart-bench/
├─ src/
│  ├─ pages/          # 页面：首页、语音助手、紧急呼叫、位置检索、能源、充电、信息发布、隐私、通话、多杆联动、3D 展示
│  ├─ components/     # 通用组件：Logo、图标、3D 舞台、真实地图、滚动叙事
│  ├─ services/       # 服务层：大模型、语音、高德地图、实时同步、天气
│  ├─ mock/           # Mock 数据
│  ├─ App.tsx         # 顶部导航与路由
│  └─ index.css       # 全局样式与设计变量
├─ docs/              # 项目文档
├─ public/models/     # 3D 模型（bench.glb）
└─ .env.example       # 环境变量模板
```

## 文档

| 文档 | 内容 |
|------|------|
| [功能定义](docs/FEATURES.md) | 完整功能清单与实现状态 |
| [技术方案](docs/TECH_PLAN.md) | 架构、技术选型、模块拆解、排期与风险预案 |
| [开发文档](docs/DEVELOPMENT.md) | 本地开发、目录结构、Mock 约定 |
| [部署指南](docs/DEPLOYMENT.md) | 静态托管部署、环境变量与常见问题 |
| [外观建模指导](docs/MODELING_GUIDE.md) | 外观形态、元件位置、关键尺寸与模型导出规范 |
| [Git 协作指南](docs/GIT_WORKFLOW.md) | 分支策略与提交规范 |

## 许可

本项目为参赛作品，保留所有权利（All Rights Reserved）。详见 [LICENSE](LICENSE)。
