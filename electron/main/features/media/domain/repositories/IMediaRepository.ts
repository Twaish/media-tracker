import { Pagination, PaginationResult } from '@shared/types'
import {
  AddMediaDTO,
  BulkUpdateMediaDTO,
  MediaSearchOptions,
  UpdateMediaDTO,
} from '../../application/dto/mediaDto'
import { PersistedMedia } from '../entities/media'

export interface IMediaRepository {
  getById(id: number): Promise<PersistedMedia>
  getByIds(ids: number[]): Promise<PersistedMedia[]>
  getWithPagination(
    options: Pagination,
  ): Promise<PaginationResult<PersistedMedia>>
  add(media: AddMediaDTO): Promise<PersistedMedia>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: UpdateMediaDTO): Promise<PersistedMedia>
  search(options: MediaSearchOptions): Promise<PaginationResult<PersistedMedia>>
  bulkUpdate(
    mediaUpdates: BulkUpdateMediaDTO,
  ): Promise<{ affected: number; ids: number[] }>
  findDuplicateCandidates(
    media: Partial<AddMediaDTO>,
  ): Promise<PersistedMedia[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedMedia>
}
