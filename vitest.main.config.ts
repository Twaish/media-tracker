import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './electron/main'),
      '@domain': path.resolve(__dirname, './electron/main/domain'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  test: {
    dir: './electron/main/tests/usecases',
    environment: 'node',
    globals: true,
    include: ['**/*.test.ts'],
  },
})
