import { DEFAULT_GENRES } from '@/domain/entities/genre'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const genresTable = sqliteTable('genres', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  isDeletable: int({ mode: 'boolean' }).notNull().default(false),
})

export async function seedGenresTable(database: LibSQLDatabase) {
  for (const name of DEFAULT_GENRES) {
    try {
      await database.insert(genresTable).values({ name }).onConflictDoNothing()
    } catch (err) {
      console.error(err)
    }
  }
}
