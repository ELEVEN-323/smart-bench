# 智能助老座椅 · smart-bench

> 面向老年群体的**智慧公共座椅 / 智慧灯杆** —— 适老化结构 + 紧急救助 + 健康关怀 + 便民服务 + 照明能源

[![Repo](https://img.shields.io/badge/GitHub-smart--bench-blue)](https://github.com/ELEVEN-323/smart-bench)

**在线体验地址：** https://smart-bench-bdlywswb.edgeone.cool

---

## 📖 这是什么

本项目是一套智慧公共设施的 **Web 演示系统**，包含首页总览与语音助手两个页面，可部署为静态网站，通过浏览器直接访问，无需服务器与数据库。

**核心特性：Mock 优先** —— 所有外部能力（大模型、地图、实时数据）默认走内置假数据，**无需配置任何 API Key 即可完整演示**，不会因限流、欠费或断网而失败。

---

## 📋 部署前准备

| 项 | 要求 | 说明 |
|----|------|------|
| **Node.js** | 18.12 或更高 | pnpm 10 的要求；EdgeOne 构建环境为 22.11.0 |
| **pnpm** | 10.x（锁定 10.34.5） | 仓库 `packageManager` 已锁定，平台自动使用 |
| **部署平台账号** | EdgeOne Pages 或 Vercel | 注册免费，免费额度足够 |
| **Git 账号** | — | 仅「导入 Git 仓库」的部署方式需要；EdgeOne 也支持直接上传 `dist/` 目录，无需 Git |

**代码仓库**：https://github.com/ELEVEN-323/smart-bench

> 💡 仓库中已包含 `edgeone.json` 与 `vercel.json` 两个部署配置文件，**无需手动创建**。构建命令、输出目录、Node 版本等均已预置；路由采用 **Hash 模式**（`#/`），在任何静态托管上都无需额外的路由回退配置。

---

## 🚀 方式一：EdgeOne Pages 部署（推荐）

国内平台，**访问速度快，且不需要 GitHub 账号授权**，用微信 / QQ / 邮箱即可注册（腾讯云需先完成实名认证）。

### 步骤

1. 打开 https://console.cloud.tencent.com/edgeone/pages （腾讯云 EdgeOne Pages 控制台）
2. 新建项目 → 选择 **导入 Git 仓库** → 授权并选择 **`smart-bench`**
   > 也可以不走 Git：本地执行 `pnpm build`，把生成的 `dist/` 目录**直接拖拽上传**即可
3. 构建设置（仓库内 `edgeone.json` 已预置，通常会自动读取）：

   | 配置项 | 值 |
   |--------|-----|
   | 安装命令 | `pnpm install` |
   | 构建命令 | `pnpm build` |
   | 输出目录 | `dist` |
   | Node 版本 | `22.11.0` |

   > ⚠️ **Root Directory 必须留空**（代码在仓库根目录，不是子目录）

4. 按需配置环境变量（见下方「环境变量配置」），演示场景可**直接跳过**
5. 开始部署，等待构建完成，获得在线地址

> 💡 本项目路由采用 **Hash 模式**（地址形如 `/#/assistant`），路由完全在浏览器端处理，服务器只返回首页，因此**任何静态托管都不会出现刷新 404**，无需配置路由回退。

### 后续更新

```bash
git push origin main
```

推送后 EdgeOne 自动重新构建，无需任何手动操作。

---

## 🌐 方式二：Vercel 部署（备用）

> ⚠️ **已知问题**：Vercel 对中国大陆网络环境的注册 / 登录风控较严，可能提示
> `Your account requires further verification` 而无法登录。
> 遇到时先试 **Continue with GitHub** 登录；仍不通过请改用「方式一」。

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
- [ ] 点击右上角 **语音助手**，地址栏变成 `/#/assistant`，页面正常切换
- [ ] **在语音助手页按 F5 刷新，页面仍正常显示**（Hash 路由下刷新不会 404）
- [ ] 在语音助手中点快捷问题（如「今天天气怎么样？」），能返回回答
- [ ] 点击 **🔊 播报上一条**，能听到中文语音（需 Chrome / Edge，且设备未静音）
- [ ] 用手机浏览器打开，页面布局正常

---

## ❓ 常见问题

### Q1：路由页面刷新出现 404

本项目已采用 **Hash 路由**（地址形如 `/#/assistant`），正常情况下刷新不会 404。

如果你看到的地址是 `/assistant`（没有 `#`）且刷新 404，说明运行的是旧版本、或 `src/main.tsx` 里用了 `BrowserRouter`。请确认用的是 `HashRouter`，然后重新构建部署。

### Q2：构建失败，报 `ERR_PNPM_IGNORED_BUILDS: esbuild`

`pnpm-workspace.yaml` 被误删或被还原。该文件必须包含：

```yaml
onlyBuiltDependencies:
  - esbuild
```

`esbuild` 是 Vite 的构建依赖，需要执行 `postinstall`；未显式允许时构建会报 `ERR_PNPM_IGNORED_BUILDS`（pnpm 11 甚至会拒绝执行任何命令，本仓库已锁定 pnpm 10.34.5 与之兼容）。

### Q3：构建失败，提示 Node 版本过低

本项目要求 **Node.js 18.12 及以上**（pnpm 10 的要求）。请在部署平台的设置中确认 Node 版本：

- **EdgeOne Pages**：构建设置中的 Node 版本填 `22.11.0`（平台预装版本，仓库 `edgeone.json` 已配置）
- **Vercel**：Settings → General → Node.js Version，选 22.x

### Q4：点播报按钮没声音

- 浏览器需为 **Chrome 或 Edge**（依赖 Web Speech API），其他浏览器会提示不支持
- 检查系统音量与标签页是否被静音
- 部分浏览器要求页面有过交互后才允许播放，先点击页面任意位置再试

### Q5：回答内容像是固定的假答案

这是**预期行为**。当前处于 Mock 模式，问答由内置规则库返回。要接入真实大模型，见上方「接入真实大模型」。

### Q6：Vercel 登录提示 `Your account requires further verification`

Vercel 对大陆网络环境的注册 / 登录风控较严。可先试 **Continue with GitHub** 登录；若仍不通过，直接改用「方式一 EdgeOne Pages」——本项目的产物是纯静态文件，换平台不影响任何功能。

### Q7：部署后地址国内访问很慢

请使用「方式一 EdgeOne Pages」（国内节点）。Vercel 国内访问不稳定，仅建议作为备用地址。也可以两个都部署，答辩现场随时切换。

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
| [**功能定义**](docs/FEATURES.md) | 产品完整功能清单：8 大模块 + 6 组 AI 能力，标注实现状态 |
| [技术方案](docs/TECH_PLAN.md) | 范围边界、系统架构、技术选型、模块拆解、排期与风险预案 |
| [开发文档](docs/DEVELOPMENT.md) | 本地开发、目录结构、功能规划、Mock 优先约定 |
| [外观建模指导](docs/MODELING_GUIDE.md) | 设计组：外观形态、元件位置、关键尺寸与 `.glb` 导出规范 |
| [团队 Git 协作指南](docs/GIT_WORKFLOW.md) | 分支策略、日常流程、Commit 规范 |

---

## 📄 许可

本项目为参赛作品，保留所有权利。
