import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './electron/main'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: [
      'electron/main/tests/unit/**/*.test.ts',
      'electron/main/features/**/*.test.ts',
    ],
  },
})
