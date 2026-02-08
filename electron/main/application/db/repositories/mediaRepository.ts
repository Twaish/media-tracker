import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import { Media } from '@/domain/entities/media'

export interface MediaRepository {
  getById(id: number): Promise<Media>
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
  update(media: MediaUpdateInput): Promise<Media>
}
