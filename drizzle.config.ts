import { defineConfig } from 'drizzle-kit'
import path from 'path'

const databaseFilePath = './local.db'

export default defineConfig({
  out: './drizzle',
  schema: './electron/main/infrastructure/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${path.resolve(databaseFilePath)}`,
  },
})
