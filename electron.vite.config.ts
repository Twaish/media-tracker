import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/main.ts'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'electron/main'),
        '@domain': resolve(__dirname, 'electron/main/domain'),
        '@shared': resolve(__dirname, 'shared'),
      },
    },
  },
  preload: {
    build: {
      externalizeDeps: true,
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/preload.ts'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'electron/preload'),
        '@shared': resolve(__dirname, 'shared'),
      },
    },
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@shared': resolve(__dirname, 'shared'),
      },
    },
    plugins: [react(), tailwindcss()],
  },
})
