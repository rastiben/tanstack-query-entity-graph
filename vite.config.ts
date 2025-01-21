import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  lib: {
    entry: resolve(__dirname, 'src/index.ts'),
    name: 'tanstack-query-entity-graph',
    fileName: 'index'
  },
  plugins: [react()],
})
