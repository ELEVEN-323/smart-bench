import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // 项目在 OneDrive 下，原生 fs.watch 会因临时文件被锁报 EBUSY 崩溃；
    // 改用轮询 + 忽略临时目录，避免答辩开发时反复掉线。
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/*.tmpdir/**', '**/*.tmp'],
      usePolling: true,
      interval: 1000,
    },
  },
})
