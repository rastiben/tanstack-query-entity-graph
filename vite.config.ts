import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  lib: {
    entry: resolve(__dirname, 'src/lib/index.ts'),
    formats: ['es', 'umd'],
    name: 'tanstack-query-entity-graph',
    fileName: (format) =>
        format === 'umd'
            ? 'tanstack-query-entity-graph.umd.cjs'
            : 'tanstack-query-entity-graph.js'
  },
  plugins: [react(), dts({ include: ["./src/lib"]})],
})
