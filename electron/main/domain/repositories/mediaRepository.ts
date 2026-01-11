import { MediaCreateInput, MediaPaginationOptions } from '@shared/types'
import { Media } from '../entities/media'

export interface MediaRepository {
  getWithPagination(options: MediaPaginationOptions): Promise<{
    data: Media[]
    pagination: {
      page: number
      limit: number
      totalPages: number
      totalItems: number
    }
  }>
  add(media: MediaCreateInput): Promise<Media>
  remove(mediaIds: number[]): Promise<{ deleted: number; ids: number[] }>
}
