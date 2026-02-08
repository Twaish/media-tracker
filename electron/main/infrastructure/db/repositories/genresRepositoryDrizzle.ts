import { Genre } from '@/domain/entities/genre'
import { genresTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { GenresRepository } from '@/application/db/repositories/genresRepository'

export class GenresRepositoryDrizzle implements GenresRepository {
  constructor(private readonly db: LibSQLDatabase) {}

  async get(): Promise<Genre[]> {
    const rows = await this.db.select().from(genresTable)
    return rows.map(this.toDomain)
  }

  private toDomain(row: typeof genresTable.$inferSelect): Genre {
    return Genre.create(row).withId(row.id)
  }
}
