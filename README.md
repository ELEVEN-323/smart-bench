# 智能助老座椅 · smart-bench

> 面向老年群体的**智慧公共座椅 / 智慧灯杆** —— 适老化结构 + 紧急救助 + 健康关怀 + 便民服务 + 照明能源

[![Repo](https://img.shields.io/badge/GitHub-smart--bench-blue)](https://github.com/ELEVEN-323/smart-bench)

**在线体验地址：** _（部署完成后在此填入地址）_

---

## 📖 这是什么

本项目是一套智慧公共设施的 **Web 演示系统**，包含首页总览与语音助手两个页面，可部署为静态网站，通过浏览器直接访问，无需服务器与数据库。

**核心特性：Mock 优先** —— 所有外部能力（大模型、地图、实时数据）默认走内置假数据，**无需配置任何 API Key 即可完整演示**，不会因限流、欠费或断网而失败。

---

## 📋 部署前准备

| 项 | 要求 | 说明 |
|----|------|------|
| **Node.js** | 22 或更高 | 构建环境要求，平台一般已预装 |
| **pnpm** | 11.x | 项目使用 pnpm，锁文件已随仓库提供 |
| **GitHub 账号** | — | 用于托管代码并触发自动部署 |
| **部署平台账号** | Vercel 或 EdgeOne Pages | 均可用 GitHub 账号直接登录，免费额度足够 |

**代码仓库**：https://github.com/ELEVEN-323/smart-bench

> 💡 仓库中已包含 `vercel.json` 与 `edgeone.json` 两个部署配置文件（含单页应用路由回退规则），**无需手动创建**。构建命令、输出目录、Node 版本等均已预置。

---

## 🚀 方式一：Vercel 部署（推荐）

Vercel 与 GitHub 打通后，**每次推送代码都会自动重新构建部署**。

### 步骤

1. 打开 https://vercel.com ，用 **GitHub 账号登录**
2. 点击 **Add New… → Project**
3. 在列表中找到 **`smart-bench`** 仓库，点 **Import**
   > 首次使用需先授权 Vercel 访问你的 GitHub 仓库
4. 配置页保持默认即可，Vercel 会自动识别为 Vite 项目：

   | 配置项 | 自动识别结果 |
   |--------|--------------|
   | Framework Preset | Vite |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

   > ⚠️ **Root Directory 必须留空**（代码在仓库根目录，不是子目录）

5. 展开 **Environment Variables**，按需填入密钥（见下方「环境变量配置」）
   > 演示场景可**直接跳过**，不填任何变量也能正常运行
6. 点 **Deploy**，等待约 1–2 分钟
7. 部署成功后获得形如 `https://smart-bench-xxxx.vercel.app` 的地址

### 后续更新

```bash
git push origin main
```

推送后 Vercel 自动重新构建，无需任何手动操作。

---

## 🇨🇳 方式二：EdgeOne Pages 部署（国内访问备用）

Vercel 在国内访问偶尔较慢，建议**同时部署一份 EdgeOne Pages 作为备用地址**，答辩现场可随时切换。

### 步骤

1. 打开 https://pages.edgeone.ai ，用账号登录
2. 新建项目 → 选择 **导入 Git 仓库** → 授权并选择 **`smart-bench`**
3. 构建设置（仓库内 `edgeone.json` 已预置，通常会自动读取）：

   | 配置项 | 值 |
   |--------|-----|
   | 安装命令 | `pnpm install` |
   | 构建命令 | `pnpm build` |
   | 输出目录 | `dist` |
   | Node 版本 | `22.11.0` |

4. 按需配置环境变量（可跳过）
5. 开始部署，等待构建完成，获得在线地址

> 💡 EdgeOne Pages 会自动识别单页应用并处理路由回退；`edgeone.json` 中也已显式声明，双保险。

---

## 🔑 环境变量配置

> ✅ **不配置任何变量也能完整演示**（默认 Mock 模式）。以下仅在想接入真实能力时需要。

在部署平台的 **Environment Variables / 环境变量** 设置中添加：

| 变量名 | 用途 | 是否必需 |
|--------|------|----------|
| `VITE_USE_MOCK` | 全局 Mock 开关。`true` = 全用假数据 | 否，默认 `true` |
| `VITE_LLM_API_KEY` | DeepSeek API 密钥 | 接入真实大模型时必填 |
| `VITE_LLM_BASE_URL` | DeepSeek API 地址 | 否，默认 `https://api.deepseek.com` |
| `VITE_AMAP_KEY` | 高德地图 JS API 密钥 | 位置检索功能使用 |
| `VITE_SUPABASE_URL` | Supabase 项目地址 | 多杆联动功能使用 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 多杆联动功能使用 |

### 接入真实大模型

1. 在平台上添加 `VITE_LLM_API_KEY`，填入你的 DeepSeek 密钥
2. 添加 `VITE_USE_MOCK`，值设为 **`false`**
3. **重新部署**（环境变量变更需重新构建才生效）

> ⚠️ **安全提醒**：`VITE_` 前缀的变量会被打包进前端 JavaScript，**任何访问者都能在浏览器中查看到**。请使用有额度限制的密钥，不要放入生产级或高额度密钥。

---

## ✅ 部署后验证清单

部署完成后，请逐项确认：

- [ ] 首页能正常打开，主视觉标题「让每一次落座，都安心。」显示正常
- [ ] 页面下方滚动能出现「功能模块」列表与座椅线稿图
- [ ] 点击右上角 **语音助手**，页面正常切换
- [ ] **直接访问 `/assistant` 并刷新页面，不出现 404**
      ← 这一步验证单页应用路由回退是否生效，**最容易出问题，务必测试**
- [ ] 在语音助手中点快捷问题（如「今天天气怎么样？」），能返回回答
- [ ] 点击 **🔊 播报上一条**，能听到中文语音（需 Chrome / Edge，且设备未静音）
- [ ] 用手机浏览器打开，页面布局正常

---

## ❓ 常见问题

### Q1：刷新 `/assistant` 页面出现 404

单页应用路由回退未生效。仓库中的 `vercel.json` / `edgeone.json` 已包含修复规则，请确认：

- 这两个文件确实在**仓库根目录**（不在子文件夹）
- 部署平台的 **Root Directory 留空**
- 修改配置后需**重新部署**才生效

### Q2：构建失败，报 `ERR_PNPM_IGNORED_BUILDS: esbuild`

`pnpm-workspace.yaml` 被误删或被还原。该文件必须包含：

```yaml
allowBuilds:
  esbuild: true
```

`esbuild` 是 Vite 的构建依赖，pnpm 11 默认禁止依赖执行构建脚本，未显式允许会导致所有 pnpm 命令失败。

### Q3：构建失败，提示 Node 版本过低

本项目要求 **Node.js 22 及以上**。请在部署平台的设置中将 Node 版本调整为 22.x：

- **Vercel**：Settings → General → Node.js Version
- **EdgeOne Pages**：构建设置中的 Node 版本，填 `22.11.0`

### Q4：点播报按钮没声音

- 浏览器需为 **Chrome 或 Edge**（依赖 Web Speech API），其他浏览器会提示不支持
- 检查系统音量与标签页是否被静音
- 部分浏览器要求页面有过交互后才允许播放，先点击页面任意位置再试

### Q5：回答内容像是固定的假答案

这是**预期行为**。当前处于 Mock 模式，问答由内置规则库返回。要接入真实大模型，见上方「接入真实大模型」。

### Q6：部署后地址国内访问很慢

Vercel 国内访问不稳定，请按「方式二」再部署一份 EdgeOne Pages 作为备用地址。

---

## 💻 本地运行（可选）

只想在本机预览，不部署：

```bash
# 1. 克隆仓库
git clone https://github.com/ELEVEN-323/smart-bench.git
cd smart-bench

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

打开 http://localhost:5173

预览生产构建产物：

```bash
pnpm build      # 构建，输出到 dist/
pnpm preview    # 本地预览，默认 http://localhost:4173
```

---

## 📁 项目结构

```
smart-bench/
├─ src/
│  ├─ components/     # 通用组件（Logo、图标、滚动动画、座椅线稿）
│  ├─ pages/          # 页面：Home（首页）、Assistant（语音助手）
│  ├─ services/       # 服务封装层：llm（大模型）、tts（语音播报）
│  ├─ mock/           # Mock 数据（无 Key 时的兜底回答）
│  ├─ App.tsx         # 顶栏 + 路由 + 页脚
│  └─ index.css       # 全局样式与设计 token
├─ docs/              # 项目文档
├─ vercel.json        # Vercel 部署配置
├─ edgeone.json       # EdgeOne Pages 部署配置
├─ pnpm-workspace.yaml# 构建脚本审批（勿删）
└─ .env.example       # 环境变量模板
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| [技术方案](docs/TECH_PLAN.md) | 范围边界、系统架构、技术选型、模块拆解、排期与风险预案 |
| [开发文档](docs/DEVELOPMENT.md) | 本地开发、目录结构、功能规划、Mock 优先约定 |
| [团队 Git 协作指南](docs/GIT_WORKFLOW.md) | 分支策略、日常流程、Commit 规范 |

---

## 📄 许可

本项目为参赛作品，保留所有权利。
