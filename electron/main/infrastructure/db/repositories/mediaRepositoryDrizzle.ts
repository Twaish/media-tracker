import { genresTable, mediaGenresTable, mediaTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { GenreDTO, Media } from '@/domain/entities/media'
import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import {
  inArray,
  desc,
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
} from 'drizzle-orm'
import { Filter } from '@/domain/services/QueryResolver'
import { SQLiteColumn } from 'drizzle-orm/sqlite-core'

export class MediaRepositoryDrizzle implements IMediaRepository {
  private readonly columnMap: Record<string, SQLiteColumn> = {
    id: mediaTable.id,
    title: mediaTable.title,
    currentepisode: mediaTable.currentEpisode,
    maxepisodes: mediaTable.maxEpisodes,
    mediatype: mediaTable.mediaType,
    status: mediaTable.status,
    createdat: mediaTable.createdAt,
  }

  constructor(private readonly db: LibSQLDatabase) {}

  async getById(id: number): Promise<Media> {
    const [row] = await this.db
      .select()
      .from(mediaTable)
      .where(eq(mediaTable.id, id))

    if (!row) {
      throw new Error(`Media with id ${id} not found`)
    }

    const genreRows = await this.db
      .select({
        id: genresTable.id,
        name: genresTable.name,
      })
      .from(mediaGenresTable)
      .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
      .where(eq(mediaGenresTable.mediaId, id))

    const genreDTOs = genreRows.map((row) => ({
      id: row.id,
      name: row.name,
    }))

    return this.toDomain(row, genreDTOs)
  }

  private async fetchMediaWithGenresQuery(
    whereClause?: SQL,
    limit?: number,
    offset?: number,
  ) {
    const query = this.db
      .select({
        media: mediaTable,
        genres: sql<GenreDTO[]>`
          COALESCE(
            json_group_array(
              CASE
                WHEN ${genresTable.id} IS NOT NULL THEN
                  json_object(
                    'id', ${genresTable.id},
                    'name', ${genresTable.name}
                  )
              END
            ),
            '[]'
          )
        `,
      })
      .from(mediaTable)
      .leftJoin(mediaGenresTable, eq(mediaTable.id, mediaGenresTable.mediaId))
      .leftJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
      .where(whereClause)
      .groupBy(mediaTable.id)
      .orderBy(desc(mediaTable.createdAt))

    if (limit) query.limit(limit)
    if (offset) query.offset(offset)

    const [rows, totalItems] = await Promise.all([
      query,
      this.db.select({ count: count() }).from(mediaTable).where(whereClause),
    ])

    return {
      media: rows.map(({ media, genres }) =>
        this.toDomain(media, JSON.parse(genres as unknown as string) ?? []),
      ),
      totalItems: Number(totalItems[0].count),
    }
  }

  async getWithPagination(options: MediaPaginationOptions) {
    return await this.search({ pagination: options })
  }

  async add(media: MediaCreateInput): Promise<Media> {
    const [newMedia] = await this.db
      .insert(mediaTable)
      .values(media)
      .returning()
    const mediaId = newMedia.id
    if (media.genres && media.genres.length > 0) {
      const genreRows = media.genres.map((genreId) => ({
        mediaId,
        genreId,
      }))
      await this.db.insert(mediaGenresTable).values(genreRows)
    }

    const rows = await this.db
      .select({
        id: genresTable.id,
        name: genresTable.name,
      })
      .from(genresTable)
      .where(inArray(genresTable.id, media.genres ?? []))
    const genreDTOs = rows.map((row) => ({ id: row.id, name: row.name }))
    return this.toDomain(newMedia, genreDTOs)
  }

  async update(input: MediaUpdateInput): Promise<Media> {
    return await this.db.transaction(async (tx) => {
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

      const [mediaRow] = await tx
        .select()
        .from(mediaTable)
        .where(eq(mediaTable.id, id))
        .limit(1)

      if (!mediaRow) {
        throw new Error(`Media with id ${id} not found`)
      }

      const genreRows = await tx
        .select({
          id: genresTable.id,
          name: genresTable.name,
        })
        .from(mediaGenresTable)
        .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
        .where(eq(mediaGenresTable.mediaId, id))

      const genreDTOs = genreRows.map((genre) => ({
        id: genre.id,
        name: genre.name,
      }))

      return this.toDomain(mediaRow, genreDTOs)
    })
  }

  async remove(
    mediaIds: number[],
  ): Promise<{ deleted: number; ids: number[] }> {
    if (!mediaIds.length) return { deleted: 0, ids: [] }
    const rows = await this.db
      .delete(mediaTable)
      .where(inArray(mediaTable.id, mediaIds))
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
    pagination: MediaPaginationOptions
  }) {
    const { page = 1, limit = 12 } = pagination ?? {}
    const offset = (page - 1) * limit

    const conditions = []

    if (title) {
      conditions.push(like(mediaTable.title, `%${title}%`))
    }

    for (const filter of filters) {
      const condition = this.buildCondition(filter)
      if (condition) conditions.push(condition)
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const { media, totalItems } = await this.fetchMediaWithGenresQuery(
      whereClause,
      limit,
      offset,
    )

    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: media,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
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
    row: typeof mediaTable.$inferSelect,
    genres: GenreDTO[] = [],
  ): Media {
    return Media.create({ ...row, genres }).withId(row.id)
  }
}
