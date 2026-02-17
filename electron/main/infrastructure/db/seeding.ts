import { DrizzleDb } from './types'
import { seedGenresTable } from './tables/genres.table'

export async function seedDatabase(database: DrizzleDb) {
  await seedGenresTable(database)
}
