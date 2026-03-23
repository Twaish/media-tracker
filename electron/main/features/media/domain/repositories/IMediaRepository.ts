import { Pagination } from '@shared/types/pagination'
import {
  AddMediaDTO,
  BulkUpdateMediaDTO,
  MediaPaginationResult,
  UpdateMediaDTO,
} from '../../application/dto/mediaDto'
import { PersistedMedia } from '../entities/media'
import { Filter } from '../query/Filter'

export interface IMediaRepository {
  getById(id: number): Promise<PersistedMedia>
  getByIds(ids: number[]): Promise<PersistedMedia[]>
  getWithPagination(options: Pagination): Promise<MediaPaginationResult>
  add(media: AddMediaDTO): Promise<PersistedMedia>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: UpdateMediaDTO): Promise<PersistedMedia>
  search(options: {
    title?: string
    filters?: Filter[]
    pagination?: Pagination
  }): Promise<MediaPaginationResult>
  bulkUpdate(
    mediaUpdates: BulkUpdateMediaDTO,
  ): Promise<{ affected: number; ids: number[] }>
  findDuplicateCandidates(
    media: Partial<AddMediaDTO>,
  ): Promise<PersistedMedia[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedMedia>
}
