import { Genre } from '@/domain/entities/genre'
import { genresTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'

export class GenresRepositoryDrizzle implements IGenresRepository {
  constructor(private readonly db: LibSQLDatabase) {}

  async get(): Promise<Genre[]> {
    const rows = await this.db.select().from(genresTable)
    return rows.map(this.toDomain)
  }

  private toDomain(row: typeof genresTable.$inferSelect): Genre {
    return Genre.create(row).withId(row.id)
  }
}
