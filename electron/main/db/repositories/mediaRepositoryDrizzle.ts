import { mediaTable } from '../schema'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { MediaRepository } from '@/domain/repositories/mediaRepository'
import { Media } from '@/domain/entities/media'
import { MediaCreateInput, MediaPaginationOptions } from '@shared/types'
import { inArray, desc, count } from 'drizzle-orm'

export class MediaRepositoryDrizzle implements MediaRepository {
  constructor(private readonly db: LibSQLDatabase) {}

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

    const [media, totalItems] = await Promise.all([
      this.db
        .select()
        .from(mediaTable)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(mediaTable.createdAt)),
      this.db.select({ count: count() }).from(mediaTable),
    ])

    const totalPages = Math.ceil(Number(totalItems[0].count) / limit)

    return {
      data: media.map(this.toDomain),
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: Number(totalItems[0].count),
      },
    }
  }

  async add(media: MediaCreateInput): Promise<Media> {
    const newMedia = await this.db.insert(mediaTable).values(media).returning()
    return this.toDomain(newMedia[0])
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

  private toDomain(row: typeof mediaTable.$inferSelect): Media {
    return Media.create(row).withId(row.id)
  }
}
