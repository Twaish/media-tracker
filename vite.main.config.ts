import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['libsql', '@libsql/client', '@libsql/win32-x64-msvc'],
    },
  },
  optimizeDeps: {
    exclude: ['libsql', '@libsql/client', '@libsql/win32-x64-msvc'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
