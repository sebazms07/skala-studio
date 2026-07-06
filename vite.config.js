import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/skala-studio/' : '/',
  plugins: [
    vue(),
    {
      name: 'copy-404',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // Para GitHub Pages SPA: copiar dist/index.html a dist/404.html
        const distDir = resolve(__dirname, 'dist')
        copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'))
      },
    },
  ],
})
