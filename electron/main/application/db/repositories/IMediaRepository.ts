import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import { Media, PersistedMedia } from '@/domain/entities/media'
import { Filter } from '@/domain/services/QueryResolver'

export type MediaPaginationResult = {
  data: PersistedMedia[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}

export interface IMediaRepository {
  getById(id: number): Promise<PersistedMedia>
  getWithPagination(
    options: MediaPaginationOptions,
  ): Promise<MediaPaginationResult>
  add(media: MediaCreateInput): Promise<PersistedMedia>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: MediaUpdateInput): Promise<PersistedMedia>
  search(options: {
    title?: string
    filters?: Filter[]
    pagination?: MediaPaginationOptions
  }): Promise<MediaPaginationResult>
}
