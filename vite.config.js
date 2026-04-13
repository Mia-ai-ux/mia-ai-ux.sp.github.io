import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/**
 * 相对路径：本地用 `npx serve docs` / `vite preview` 打开构建结果时资源能加载；
 * GitHub Pages 项目站（子路径部署）同样适用。
 */
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? './' : '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
}))
