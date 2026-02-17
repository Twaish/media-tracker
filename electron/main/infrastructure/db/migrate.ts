import path from 'path'
import { app } from 'electron'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { DrizzleDb } from './types'

export async function runMigrations(db: DrizzleDb) {
  const appPath = app.getAppPath()

  const migrationsPath = path.join(appPath, 'drizzle')

  await migrate(db, {
    migrationsFolder: migrationsPath,
  })
}
