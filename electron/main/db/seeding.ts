import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { DEFAULT_GENRES, genresTable } from './schema'

export async function seedDefaultGenres(database: LibSQLDatabase) {
  for (const name of DEFAULT_GENRES) {
    try {
      await database.insert(genresTable).values({ name }).onConflictDoNothing()
    } catch (err) {
      console.error(err)
    }
  }
}
