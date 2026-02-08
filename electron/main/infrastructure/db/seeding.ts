import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { seedGenresTable } from './tables/genres.table'

export async function seedDatabase(database: LibSQLDatabase) {
  await seedGenresTable(database)
}
