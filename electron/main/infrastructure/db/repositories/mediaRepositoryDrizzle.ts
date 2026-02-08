import { genresTable, mediaGenresTable, mediaTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { MediaRepository } from '@/application/db/repositories/mediaRepository'
import { GenreDTO, Media } from '@/domain/entities/media'
import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import { inArray, desc, count, eq } from 'drizzle-orm'

export class MediaRepositoryDrizzle implements MediaRepository {
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

  private toDomain(
    row: typeof mediaTable.$inferSelect,
    genres: GenreDTO[] = [],
  ): Media {
    return Media.create({ ...row, genres }).withId(row.id)
  }
}
