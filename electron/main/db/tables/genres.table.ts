import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const genresTable = sqliteTable('genres', {
  id: int().primaryKey(),
  name: text().notNull().unique(),
  isDeletable: int({ mode: 'boolean' }).notNull().default(false),
})

export const DEFAULT_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Thriller',
] as const

export async function seedGenresTable(database: LibSQLDatabase) {
  await database.transaction(async (tx) => {
    try {
      await tx
        .insert(genresTable)
        .values(DEFAULT_GENRES.map((name) => ({ name })))
        .onConflictDoNothing()
    } catch (err) {
      console.error(err)
    }
  })
}
