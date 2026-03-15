import { genresTable, mediaGenresTable, mediaTable } from '../schema'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { Media, PersistedMedia } from '@/domain/entities/media'
import {
  AddMediaDTO,
  BulkUpdateMediaDTO,
  MediaPaginationOptions,
  UpdateMediaDTO,
} from '@shared/types'
import {
  inArray,
  count,
  eq,
  like,
  and,
  exists,
  not,
  ne,
  lt,
  lte,
  gt,
  gte,
  SQL,
  sql,
  isNull,
  or,
} from 'drizzle-orm'
import { Filter } from '@/domain/services/QueryResolver'
import { SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { DrizzleDb, Executor } from '../types'
import { Genre, PersistedGenre } from '@/domain/entities/genre'

export class MediaRepositoryDrizzle implements IMediaRepository {
  private readonly columnMap: Record<string, SQLiteColumn> = {
    id: mediaTable.id,
    title: mediaTable.title,
    currentepisode: mediaTable.currentEpisode,
    maxepisodes: mediaTable.maxEpisodes,
    type: mediaTable.type,
    status: mediaTable.status,
    createdat: mediaTable.createdAt,
  }

  constructor(private readonly db: DrizzleDb) {}

  async getById(id: number, executor: Executor = this.db) {
    const media = await executor.query.mediaTable.findFirst({
      where: (m) => and(eq(m.id, id), isNull(m.deletedAt)),
      with: {
        mediaGenres: {
          with: {
            genre: true,
          },
        },
      },
    })

    if (!media) throw new Error(`Media with id ${id} not found`)

    return this.toDomain(media)
  }

  async getByIds(ids: number[]): Promise<PersistedMedia[]> {
    if (ids.length === 0) return []
    const mediaList = await this.db.query.mediaTable.findMany({
      where: (m) => and(inArray(m.id, ids), isNull(m.deletedAt)),
      with: {
        mediaGenres: {
          with: {
            genre: true,
          },
        },
      },
    })

    if (!mediaList || !mediaList.length) return []

    return mediaList.map(this.toDomain)
  }

  async getWithPagination(options: MediaPaginationOptions) {
    return this.search({ pagination: options })
  }

  async add(input: AddMediaDTO) {
    return this.db.transaction(async (tx) => {
      const { genres = [], ...mediaData } = input

      const [inserted] = await tx
        .insert(mediaTable)
        .values(mediaData)
        .returning()

      if (genres.length > 0) {
        await tx.insert(mediaGenresTable).values(
          genres.map((genreId) => ({
            mediaId: inserted.id,
            genreId,
          })),
        )
      }

      return this.getById(inserted.id, tx)
    })
  }

  async update(input: UpdateMediaDTO) {
    return this.db.transaction(async (tx) => {
      const { id, genres, ...mediaUpdates } = input

      if (Object.keys(mediaUpdates).length > 0) {
        await tx
          .update(mediaTable)
          .set(mediaUpdates)
          .where(eq(mediaTable.id, id))
      }

      if (genres) {
        await tx
          .delete(mediaGenresTable)
          .where(eq(mediaGenresTable.mediaId, id))

        if (genres.length > 0) {
          await tx.insert(mediaGenresTable).values(
            genres.map((genreId) => ({
              mediaId: id,
              genreId,
            })),
          )
        }
      }

      return this.getById(id, tx)
    })
  }

  async bulkUpdate(mediaUpdates: BulkUpdateMediaDTO) {
    const { ids, update, add, remove } = mediaUpdates

    if (!ids.length) {
      return { affected: 0, ids: [] }
    }

    return this.db.transaction(async (tx) => {
      if (update && Object.keys(update).length > 0) {
        await tx
          .update(mediaTable)
          .set(update)
          .where(and(inArray(mediaTable.id, ids), isNull(mediaTable.deletedAt)))
      }

      if (add?.genres?.length) {
        const values = ids.flatMap((mediaId) =>
          add.genres!.map((genreId) => ({
            mediaId,
            genreId,
          })),
        )

        await tx.insert(mediaGenresTable).values(values).onConflictDoNothing()
      }

      if (remove?.genres?.length) {
        await tx
          .delete(mediaGenresTable)
          .where(
            and(
              inArray(mediaGenresTable.mediaId, ids),
              inArray(mediaGenresTable.genreId, remove.genres),
            ),
          )
      }

      return { affected: ids.length, ids }
    })
  }

  async remove(ids: number[]) {
    if (!ids.length) return { deleted: 0, ids: [] }

    const now = new Date()
    const rows = await this.db
      .update(mediaTable)
      .set({ deletedAt: now })
      .where(inArray(mediaTable.id, ids))
      .returning({ id: mediaTable.id })

    return {
      deleted: rows.length,
      ids: rows.map((r) => r.id),
    }
  }

  async search({
    title,
    filters = [],
    pagination,
  }: {
    title?: string
    filters?: Filter[]
    pagination?: MediaPaginationOptions
  }) {
    const page = pagination?.page ?? 1
    const limit = pagination?.limit ?? 12
    const offset = (page - 1) * limit

    const conditions: SQL[] = []

    if (title) {
      conditions.push(like(mediaTable.title, `%${title}%`))
    }

    for (const filter of filters) {
      const condition = this.buildCondition(filter)
      if (condition) conditions.push(condition)
    }

    const whereClause =
      conditions.length > 0
        ? and(...conditions, isNull(mediaTable.deletedAt))
        : isNull(mediaTable.deletedAt)

    const [rows, totalItems] = await Promise.all([
      this.db.query.mediaTable.findMany({
        where: whereClause ? () => whereClause : undefined,
        with: {
          mediaGenres: {
            with: { genre: true },
          },
        },
        limit,
        offset,
        orderBy: (m, { desc }) => [desc(m.createdAt)],
      }),
      this.db
        .select({ count: count() })
        .from(mediaTable)
        .where(whereClause)
        .then((r) => Number(r[0]?.count ?? 0)),
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: rows.map((r) => this.toDomain(r)),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    }
  }

  async *streamAll(batchSize: number = 10): AsyncIterable<PersistedMedia> {
    let lastId: number | undefined

    while (true) {
      const rows = await this.db.query.mediaTable.findMany({
        where: lastId ? gt(mediaTable.id, lastId) : undefined,
        limit: batchSize,
        orderBy: mediaTable.id,
        with: {
          mediaGenres: {
            with: { genre: true },
          },
        },
      })

      if (rows.length === 0) return

      for (const row of rows) {
        yield this.toDomain(row)
        lastId = row.id
      }
    }
  }

  async findDuplicateCandidates(
    media: Partial<AddMediaDTO>,
  ): Promise<PersistedMedia[]> {
    const conditions = []

    if (media.externalLink) {
      conditions.push(eq(mediaTable.externalLink, media.externalLink))
    }
    if (media.thumbnail) {
      conditions.push(eq(mediaTable.thumbnail, media.thumbnail))
    }
    if (media.title) {
      conditions.push(like(mediaTable.title, `%${media.title}%`))
    }
    if (media.alternateTitles) {
      conditions.push(
        like(mediaTable.alternateTitles, `%${media.alternateTitles}%`),
      )
    }
    if (media.watchAfter) {
      conditions.push(eq(mediaTable.watchAfter, media.watchAfter))
    }

    if (conditions.length === 0) return []

    const candidates = await this.db.query.mediaTable.findMany({
      where: and(or(...conditions), isNull(mediaTable.deletedAt)),
      with: {
        mediaGenres: {
          with: {
            genre: true,
          },
        },
      },
    })

    return candidates.map(this.toDomain)
  }

  private buildCondition(filter: Filter): SQL | null {
    const field = filter.field.toLowerCase()
    if (field === 'genre') return this.buildGenreCondition(filter)

    const column = this.columnMap[field]
    if (!column) return null

    const values = filter.values
    const firstValue = values[0]

    switch (filter.op) {
      case '=':
        return values.length === 1
          ? eq(column, firstValue)
          : inArray(column, values)
      case '!=':
        return values.length === 1
          ? ne(column, firstValue)
          : not(inArray(column, values))
      case '<':
        this.assertSingleValue(filter)
        return lt(column, firstValue)
      case '<=':
        this.assertSingleValue(filter)
        return lte(column, firstValue)
      case '>':
        this.assertSingleValue(filter)
        return gt(column, firstValue)
      case '>=':
        this.assertSingleValue(filter)
        return gte(column, firstValue)
      default:
        throw new Error(
          `Unsupported operator for genre: ${filter.op satisfies never}`,
        )
    }
  }

  private buildGenreCondition(filter: Filter) {
    const lowercasedValues = filter.values
      .filter((v) => typeof v === 'string')
      .map((v) => v.toLowerCase())

    if (lowercasedValues.length === 0) return null

    const subquery = this.db
      .select({ id: mediaGenresTable.mediaId })
      .from(mediaGenresTable)
      .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
      .where(inArray(sql`lower(${genresTable.name})`, lowercasedValues))

    switch (filter.op) {
      case '=':
        return exists(subquery)
      case '!=':
        return not(exists(subquery))
      default:
        throw new Error(`Unsupported operator for genre: ${filter.op}`)
    }
  }

  private assertSingleValue(filter: Filter) {
    if (filter.values.length !== 1) {
      throw new Error(`Operator "${filter.op}" only supports a single value`)
    }
  }

  private toDomain(
    row: typeof mediaTable.$inferSelect & {
      mediaGenres: {
        genre: typeof genresTable.$inferSelect
      }[]
    },
  ): PersistedMedia {
    const genres: PersistedGenre[] = row.mediaGenres.map((mg) =>
      Genre.create({
        name: mg.genre.name,
        isDeletable: mg.genre.isDeletable,
      })
        .withId(mg.genre.id)
        .toDTO(),
    )

    return Media.create({
      ...row,
      genres,
    })
      .withId(row.id)
      .toDTO()
  }
}
