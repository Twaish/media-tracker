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
} from 'drizzle-orm'
import { Filter } from '@/domain/services/QueryResolver'
import { SQLiteColumn } from 'drizzle-orm/sqlite-core'

export class MediaRepositoryDrizzle implements IMediaRepository {
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

  async getWithPagination(options: MediaPaginationOptions): Promise<{
    data: Media[]
    pagination: {
      page: number
      limit: number
      totalPages: number
      totalItems: number
    }
  }> {
    const { page = 1, limit = 12 } = options ?? {}
    const offset = (page - 1) * limit

    const [media, totalItems, genres] = await Promise.all([
      this.db
        .select()
        .from(mediaTable)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(mediaTable.createdAt)),
      this.db.select({ count: count() }).from(mediaTable),
      this.db
        .select({
          mediaId: mediaGenresTable.mediaId,
          genreId: mediaGenresTable.genreId,
          genreName: genresTable.name,
        })
        .from(mediaGenresTable)
        .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id)),
    ])

    const genresMap = genres.reduce<Record<number, GenreDTO[]>>((acc, row) => {
      if (!acc[row.mediaId]) acc[row.mediaId] = []
      acc[row.mediaId].push({ id: row.genreId, name: row.genreName })
      return acc
    }, {})

    const totalPages = Math.ceil(Number(totalItems[0].count) / limit)

    return {
      data: media.map((media) =>
        this.toDomain(media, genresMap[media.id] ?? []),
      ),
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: Number(totalItems[0].count),
      },
    }
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
      const filterField = filter.field.toLowerCase()
      if (filterField === 'genre') {
        conditions.push(this.buildGenreCondition(filter))
        continue
      }

      const column = this.resolveColumn(filterField)
      if (!column) continue

      conditions.push(this.buildScalarCondition(column, filter))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const [mediaRows, totalCount] = await Promise.all([
      this.db
        .select()
        .from(mediaTable)
        .where(whereClause)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(mediaTable.createdAt)),
      this.db.select({ count: count() }).from(mediaTable).where(whereClause),
    ])

    const totalItems = Number(totalCount[0].count)
    const totalPages = Math.ceil(totalItems / limit)

    if (mediaRows.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          totalPages,
          totalItems,
        },
      }
    }

    const mediaIds = mediaRows.map((m) => m.id)

    const genreRows = await this.db
      .select({
        mediaId: mediaGenresTable.mediaId,
        genreId: genresTable.id,
        genreName: genresTable.name,
      })
      .from(mediaGenresTable)
      .innerJoin(genresTable, eq(mediaGenresTable.genreId, genresTable.id))
      .where(inArray(mediaGenresTable.mediaId, mediaIds))

    const genresMap = genreRows.reduce<
      Record<number, { id: number; name: string }[]>
    >((acc, row) => {
      if (!acc[row.mediaId]) acc[row.mediaId] = []
      acc[row.mediaId].push({
        id: row.genreId,
        name: row.genreName,
      })
      return acc
    }, {})

    return {
      data: mediaRows.map((row) => this.toDomain(row, genresMap[row.id] ?? [])),
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      },
    }
  }

  private resolveColumn(field: string): SQLiteColumn | null {
    switch (field.toLowerCase()) {
      case 'title':
        return mediaTable.title
      case 'id':
        return mediaTable.id
      case 'currentepisode':
        return mediaTable.currentEpisode
      case 'maxepisodes':
        return mediaTable.maxEpisodes
      case 'mediatype':
        return mediaTable.mediaType
      case 'status':
        return mediaTable.status
      default:
        return null
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

  private buildScalarCondition(column: SQLiteColumn, filter: Filter) {
    const values = filter.values

    switch (filter.op) {
      case '=':
        return values.length === 1
          ? eq(column, values[0])
          : inArray(column, values)
      case '!=':
        return values.length === 1
          ? ne(column, values[0])
          : not(inArray(column, values))
      case '<':
        this.assertSingleValue(filter)
        return lt(column, values[0])
      case '<=':
        this.assertSingleValue(filter)
        return lte(column, values[0])
      case '>':
        this.assertSingleValue(filter)
        return gt(column, values[0])
      case '>=':
        this.assertSingleValue(filter)
        return gte(column, values[0])
      default:
        throw new Error(`Unsupported operator: ${filter.op satisfies never}`)
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
