import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { Genre, PersistedGenre } from '@/domain/entities/genre'
import { DrizzleDb } from '../types'
import { genresTable } from '../schema'

export class GenresRepositoryDrizzle implements IGenresRepository {
  constructor(private readonly db: DrizzleDb) {}

  async get() {
    const rows = await this.db.query.genresTable.findMany()
    return rows.map(this.toDomain)
  }

  private toDomain(row: typeof genresTable.$inferSelect): PersistedGenre {
    return Genre.create(row).withId(row.id).toDTO()
  }
}
