// @ts-ignore
import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'docs',
  },
  base: '/wukong/',
  optimizeDeps: {
    include: [],
  },
  plugins: [reactRefresh()],
  esbuild: {
    jsxInject: "import React from 'react'",
  },
})
