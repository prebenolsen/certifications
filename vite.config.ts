import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
//
// On GitHub Pages this ships as a *project* site at
// https://prebenolsen.github.io/certifications/, so production assets and
// router basename must live under `/certifications/`. Local dev stays at `/`.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/certifications/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
