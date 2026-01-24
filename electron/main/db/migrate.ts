import { migrate } from 'drizzle-orm/libsql/migrator'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import path from 'path'
import { app } from 'electron'

export async function runMigrations(db: LibSQLDatabase) {
  const appPath = app.getAppPath()

  const migrationsPath = path.join(appPath, 'drizzle')

  await migrate(db, {
    migrationsFolder: migrationsPath,
  })
}
