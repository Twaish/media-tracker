import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'
import { Genre, PersistedGenre } from '@/domain/entities/genre'
import { DrizzleDb, Executor } from '../types'
import { genresTable } from '../schema'
import { eq, gt } from 'drizzle-orm'
import { AddGenreDTO } from '@shared/types'

export class GenresRepositoryDrizzle implements IGenresRepository {
  constructor(private readonly db: DrizzleDb) {}

  async add(genre: AddGenreDTO) {
    return this.db.transaction(async (tx) => {
      const [inserted] = await tx.insert(genresTable).values(genre).returning()

      return this.getById(inserted.id, tx)
    })
  }

  async get() {
    const rows = await this.db.query.genresTable.findMany()
    return rows.map(this.toDomain)
  }

  async getById(
    id: number,
    executor: Executor = this.db,
  ): Promise<PersistedGenre> {
    const genre = await executor.query.genresTable.findFirst({
      where: (g) => eq(g.id, id),
    })

    if (!genre) throw new Error(`Genre with id ${id} not found`)

    return this.toDomain(genre)
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
