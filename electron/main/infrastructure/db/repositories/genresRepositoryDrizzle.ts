import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { Genre, PersistedGenre } from '@/domain/entities/genre'
import { DrizzleDb } from '../types'
import { genresTable } from '../schema'
import { gt } from 'drizzle-orm'

export class GenresRepositoryDrizzle implements IGenresRepository {
  constructor(private readonly db: DrizzleDb) {}

  async get() {
    const rows = await this.db.query.genresTable.findMany()
    return rows.map(this.toDomain)
  }

  async *streamAll(batchSize: number = 500): AsyncIterable<PersistedGenre> {
    let lastId: number | undefined

    while (true) {
      const rows = await this.db
        .select()
        .from(genresTable)
        .where(lastId ? gt(genresTable.id, lastId) : undefined)
        .orderBy(genresTable.id)
        .limit(batchSize)

      if (rows.length === 0) return

      for (const row of rows) {
        yield this.toDomain(row)
        lastId = row.id
      }
    }
  }

  private toDomain(row: typeof genresTable.$inferSelect): PersistedGenre {
    return Genre.create(row).withId(row.id).toDTO()
  }
}
