# 部署指南

本项目为纯静态站点，构建产物为 `dist/`，可部署到任意静态托管平台。仓库已内置 EdgeOne Pages 与 Vercel 的配置文件，通常无需额外配置。

## 前置要求

| 项 | 要求 |
|----|------|
| Node.js | 18.12 或更高（EdgeOne 构建环境为 22.11.0） |
| pnpm | 10.x（仓库 `packageManager` 已锁定 10.34.5） |
| 部署平台 | EdgeOne Pages 或 Vercel，注册免费 |

## 方式一：EdgeOne Pages（推荐）

国内平台，访问速度快，可用微信、QQ 或邮箱注册（腾讯云需先完成实名认证）。

1. 打开腾讯云 EdgeOne Pages 控制台：https://console.cloud.tencent.com/edgeone/pages
2. 新建项目，选择「导入 Git 仓库」并选择本仓库；也可本地执行 `pnpm build` 后直接上传 `dist/` 目录，无需 Git。
3. 构建配置（`edgeone.json` 已预置，通常会自动读取）：

   | 配置项 | 值 |
   |--------|-----|
   | 安装命令 | `pnpm install` |
   | 构建命令 | `pnpm build` |
   | 输出目录 | `dist` |
   | Node 版本 | `22.11.0` |

   Root Directory 必须留空（代码位于仓库根目录）。

4. 按需配置环境变量（见下文），演示场景可直接跳过。
5. 开始部署，等待构建完成，获得在线地址。

后续更新：推送到 `main` 后自动重新构建。

## 方式二：Vercel（备用）

Vercel 对大陆网络的注册与登录风控较严，可能提示 `Your account requires further verification`。遇到时先尝试 Continue with GitHub 登录；仍不通过则改用 EdgeOne。

1. 打开 https://vercel.com ，使用 GitHub 账号登录。
2. Add New → Project，选择本仓库并 Import。
3. 保持默认配置即可，Vercel 会自动识别为 Vite 项目：

   | 配置项 | 自动识别结果 |
   |--------|--------------|
   | Framework Preset | Vite |
   | Build Command | `pnpm build` |
   | Output Directory | `dist` |
   | Install Command | `pnpm install` |

4. 按需填写环境变量。
5. 点击 Deploy，等待 1–2 分钟。

后续更新：推送到 `main` 后自动重新构建。

## 路由说明

项目使用 Hash 路由（地址形如 `/#/assistant`），路由完全由浏览器处理，服务器只返回首页。因此任何静态托管环境都不会出现刷新 404，无需配置路由回退。

## 环境变量

未配置任何变量时，全部功能以 Mock 模式运行，演示不受影响。需要接入真实能力时，在部署平台的环境变量中添加：

| 变量 | 说明 | 必需 |
|------|------|------|
| `VITE_USE_MOCK` | 全局 Mock 开关，`true` 表示全部使用内置数据 | 否，默认 `true` |
| `VITE_LLM_API_KEY` | DeepSeek API 密钥 | 接入真实大模型时必填 |
| `VITE_LLM_BASE_URL` | DeepSeek API 地址 | 否，默认 `https://api.deepseek.com` |
| `VITE_AMAP_KEY` | 高德地图 JS API 密钥 | 位置检索使用 |
| `VITE_AMAP_SECURITY` | 高德安全密钥（securityJsCode） | 与 Key 成对使用 |
| `VITE_AMAP_STYLE` | 高德自定义地图样式 ID | 否，不填使用默认样式 |
| `VITE_SUPABASE_URL` | Supabase 项目地址 | 多杆联动使用 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 多杆联动使用 |

接入真实大模型：设置 `VITE_LLM_API_KEY`，并将 `VITE_USE_MOCK` 设为 `false`，然后重新部署。

安全提醒：`VITE_` 前缀的变量会被打包进前端产物，任何访问者都能查看。请使用设置额度上限的密钥，不要使用生产级密钥。

## 部署后验证

- 首页正常打开，主视觉标题显示正常
- 顶部导航可切换页面，地址形如 `/#/assistant`
- 在任意页面刷新，不出现 404
- 语音助手中点击快捷问题，能返回回答
- 点击「播报」，能听到中文语音（Chrome 或 Edge）
- 位置检索页能加载真实地图（配置高德密钥后）
- 多杆联动页可切换座位状态
- 3D 展示页能看到可拖拽旋转的模型
- 手机浏览器打开布局正常

## 常见问题

**页面刷新 404**
项目使用 Hash 路由，正常刷新不会 404。若地址中不含 `#` 且刷新 404，说明运行的是旧版本，请确认使用 `HashRouter` 并重新部署。

**构建报错 `ERR_PNPM_IGNORED_BUILDS: esbuild`**
`pnpm-workspace.yaml` 被删除或还原。该文件需包含：

```yaml
onlyBuiltDependencies:
  - esbuild
```

**构建报错 Node 版本过低**
EdgeOne 的构建设置中 Node 版本填 `22.11.0`；Vercel 在 Settings → General → Node.js Version 选择 22.x。

**点击播报没有声音**
需要 Chrome 或 Edge（依赖 Web Speech API）；检查系统音量与标签页静音；部分浏览器要求页面先有一次交互。

**问答内容像是固定答案**
当前处于 Mock 模式，问答由内置规则库返回，属预期行为。接入真实大模型后可获得实时回答。

**国内访问慢**
优先使用 EdgeOne Pages（国内节点）。Vercel 国内访问不稳定，建议仅作备用地址。
