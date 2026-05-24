import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
    // 👇 关键：打包配置，防止压缩破坏 SSE 流逻辑
    build: {
      minify: 'esbuild', // 轻量压缩，不破坏流
      sourcemap: false,
    },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
