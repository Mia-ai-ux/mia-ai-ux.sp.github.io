import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

/** GitHub Pages project site: https://mia-ai-ux.github.io/mia-ai-ux.sp.github.io/ */
const GITHUB_PAGES_BASE = '/mia-ai-ux.sp.github.io/'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? GITHUB_PAGES_BASE : '/',
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
