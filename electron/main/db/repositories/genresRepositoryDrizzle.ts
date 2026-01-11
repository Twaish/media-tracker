import { Genre } from '@/domain/entities/genre'
import { GenresRepository } from '@/domain/repositories/genresRepository'
import { genresTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'

export class GenresRepositoryDrizzle implements GenresRepository {
  constructor(private readonly db: LibSQLDatabase) {}

  async findAll(): Promise<Genre[]> {
    const rows = await this.db.select().from(genresTable)
    return rows.map(this.toDomain)
  }

  private toDomain(row: typeof genresTable.$inferSelect): Genre {
    return Genre.create(row).withId(row.id)
  }
}
