import { genresTable, mediaGenresTable, mediaTable } from '../schema'
import {
  IMediaRepository,
  MediaPaginationResult,
} from '@/application/db/repositories/IMediaRepository'
import { GenreDTO, Media } from '@/domain/entities/media'
import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
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
} from 'drizzle-orm'
import { Filter } from '@/domain/services/QueryResolver'
import { SQLiteColumn } from 'drizzle-orm/sqlite-core'
import { DrizzleDb } from '../types'

export class MediaRepositoryDrq implements IMediaRepository {
  private readonly columnMap: Record<string, SQLiteColumn> = {
    id: mediaTable.id,
    title: mediaTable.title,
    currentepisode: mediaTable.currentEpisode,
    maxepisodes: mediaTable.maxEpisodes,
    mediatype: mediaTable.mediaType,
    status: mediaTable.status,
    createdat: mediaTable.createdAt,
  }

  constructor(private readonly db: DrizzleDb) {}

  async getById(id: number) {
    const media = await this.db.query.mediaTable.findFirst({
      where: (m) => eq(m.id, id),
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

  async getWithPagination(options: MediaPaginationOptions) {
    return this.search({ pagination: options })
  }

  async add(input: MediaCreateInput) {
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

      const created = await tx.query.mediaTable.findFirst({
        where: (m) => eq(m.id, inserted.id),
        with: {
          mediaGenres: {
            with: { genre: true },
          },
        },
      })

      if (!created) throw new Error('Failed to load created media')

      return this.toDomain(created)
    })
  }

  async update(input: MediaUpdateInput) {
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

      const updated = await tx.query.mediaTable.findFirst({
        where: (m) => eq(m.id, id),
        with: {
          mediaGenres: {
            with: { genre: true },
          },
        },
      })

      if (!updated) throw new Error(`Media with id ${id} not found`)

      return this.toDomain(updated)
    })
  }

  async remove(ids: number[]) {
    if (!ids.length) return { deleted: 0, ids: [] }
    const rows = await this.db
      .delete(mediaTable)
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

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

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
    const subquery = this.db
      .select({ id: mediaGenresTable.mediaId })
      .from(mediaGenresTable)
      .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
      .where(
        and(
          eq(mediaGenresTable.mediaId, mediaTable.id),
          inArray(genresTable.name, filter.values as string[]),
        ),
      )

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
  ): Media {
    const genres: GenreDTO[] = row.mediaGenres.map((mg) => ({
      id: mg.genre.id,
      name: mg.genre.name,
    }))

    return Media.create({
      ...row,
      genres,
    }).withId(row.id)
  }
}
