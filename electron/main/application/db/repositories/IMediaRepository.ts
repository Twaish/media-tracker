import {
  AddMediaDTO,
  BulkUpdateMediaDTO,
  MediaPaginationOptions,
  MediaPaginationResult,
  UpdateMediaDTO,
} from '@shared/types'
import { PersistedMedia } from '@/domain/entities/media'
import { Filter } from '@/domain/services/QueryResolver'

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
  findDuplicateCandidates(
    media: Partial<AddMediaDTO>,
  ): Promise<PersistedMedia[]>
}
