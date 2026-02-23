import {
  AddMediaDTO,
  MediaPaginationOptions,
  UpdateMediaDTO,
} from '@shared/types'
import { PersistedMedia } from '@/domain/entities/media'
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

export type BulkUpdateMediaDTO = {
  ids: number[]

  update?: Partial<Omit<UpdateMediaDTO, 'id' | 'genres'>>

  add?: {
    genres?: number[]
  }

  remove?: {
    genres?: number[]
  }
}

export interface IMediaRepository {
  getById(id: number): Promise<PersistedMedia>
  getWithPagination(
    options: MediaPaginationOptions,
  ): Promise<MediaPaginationResult>
  add(media: AddMediaDTO): Promise<PersistedMedia>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: UpdateMediaDTO): Promise<PersistedMedia>
  search(options: {
    title?: string
    filters?: Filter[]
    pagination?: MediaPaginationOptions
  }): Promise<MediaPaginationResult>
  bulkUpdate(mediaUpdates: BulkUpdateMediaDTO): Promise<{ affected: number }>
}
