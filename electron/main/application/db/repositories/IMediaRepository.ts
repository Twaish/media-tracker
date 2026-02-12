import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import { Media } from '@/domain/entities/media'
import { Filter } from '@/domain/services/QueryResolver'

export type MediaPaginationResult = {
  data: Media[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}

export interface IMediaRepository {
  getById(id: number): Promise<Media>
  getWithPagination(
    options: MediaPaginationOptions,
  ): Promise<MediaPaginationResult>
  add(media: MediaCreateInput): Promise<Media>
  remove(mediaIds: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: MediaUpdateInput): Promise<Media>
  search(options: {
    title?: string
    filters?: Filter[]
    pagination?: MediaPaginationOptions
  }): Promise<MediaPaginationResult>
}
