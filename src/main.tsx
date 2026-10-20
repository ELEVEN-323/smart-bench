import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css'
import 'lxgw-wenkai-webfont/lxgwwenkai-bold.css'
import App from './App'
import './index.css'

// PWA：生产环境注册 Service Worker（静态资源缓存 + 离线可用）
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {})
  })
}

// Ant Design 品牌主题：把 AntD 的设计语言对齐到我们的配色/字体
const theme = {
  token: {
    colorPrimary: '#b95a35',
    colorSuccess: '#47624f',
    colorError: '#d64541',
    colorWarning: '#f5c97b',
    colorInfo: '#b95a35',
    colorTextBase: '#262019',
    colorBgBase: '#fffdf9',
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', system-ui, sans-serif",
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <HashRouter>
        <App />
      </HashRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
