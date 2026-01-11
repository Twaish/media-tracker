import { ipcMain } from 'electron'
import { Modules } from '../types'
import { MEDIA_ADD, MEDIA_GET, MEDIA_REMOVE } from './media-channels'
import { mediaTable } from '@/db/schema'
import { count, desc, inArray } from 'drizzle-orm'
import { MediaCreateInput, MediaPaginationOptions } from '@shared/types'

export function addMediaEventListeners({ Database, StorageService }: Modules) {
  ipcMain.handle(MEDIA_GET, async (_, options: MediaPaginationOptions) => {
    const { page = 1, limit = 12 } = options ?? {}

    console.log('GETTING MEDIA')

    const offset = (page - 1) * limit

    const media = await Database.select()
      .from(mediaTable)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(mediaTable.createdAt))

    const totalItems = await Database.select({ count: count() }).from(
      mediaTable,
    )
    const totalPages = Math.ceil(Number(totalItems[0].count) / limit)

    return {
      data: media,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems: Number(totalItems[0].count),
      },
    }
  })
  ipcMain.handle(MEDIA_ADD, async (_, input: MediaCreateInput) => {
    let thumbnail: string | undefined

    if (input.thumbnail) {
      const stored = await StorageService.storeImage(input.thumbnail)
      thumbnail = stored.relativePath
    }

    const mediaToAdd = {
      ...input,
      thumbnail,
    }

    const result = await Database.insert(mediaTable)
      .values(mediaToAdd)
      .returning()

    console.log('Added ', input)

    return result[0]
  })
  ipcMain.handle(MEDIA_REMOVE, async (_, mediaIds: number[]) => {
    if (!mediaIds.length) return { deleted: 0 }

    const result = await Database.delete(mediaTable)
      .where(inArray(mediaTable.id, mediaIds))
      .returning({ id: mediaTable.id })

    return {
      deleted: result.length,
      ids: result.map((r) => r.id),
    }
  })
}
