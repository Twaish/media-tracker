import { migrate } from 'drizzle-orm/libsql/migrator'
import { DrizzleDb } from './types'

export async function runMigrations(db: DrizzleDb, migrationsPath: string) {
  await migrate(db, {
    migrationsFolder: migrationsPath,
  })
}
