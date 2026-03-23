import { PersistedMedia } from '@/features/media/domain/entities/media'
import { PersistedMediaEmbedding } from '@/features/media/domain/entities/mediaEmbedding'

export type {
  AddMediaDTO,
  UpdateMediaDTO,
  BulkUpdateMediaDTO,
  MediaPaginationResult,
} from '@/features/media/application/dto/mediaDto'

import type {
  AddMediaDTO,
  UpdateMediaDTO,
  BulkUpdateMediaDTO,
  MediaPaginationResult,
} from '@/features/media/application/dto/mediaDto'
import { Pagination } from './pagination'

export interface MediaContext {
  get(options: Pagination): Promise<MediaPaginationResult>
  add(media: AddMediaDTO): Promise<PersistedMedia>
  remove(mediaIds: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: UpdateMediaDTO): Promise<PersistedMedia>
  setNextMedia(mediaId: number, nextMediaId: number): Promise<void>
  resolveExternalLink(mediaId: number): Promise<string | null>
  search(query: string): Promise<MediaPaginationResult>
  getById(mediaId: number): Promise<PersistedMedia>
  bulkUpdate(mediaUpdates: BulkUpdateMediaDTO): Promise<{ affected: number }>
  findDuplicates(media: Partial<AddMediaDTO>): Promise<PersistedMedia[]>
  createEmbedding(
    mediaId: number,
    model: string,
  ): Promise<PersistedMediaEmbedding>
  searchEmbeddings(
    query: string,
    model: string,
  ): Promise<{ item: number; score: number }[]>
  getMediaMissingEmbeddings(model: string): Promise<number[]>
  fetchFromUrl(url: string, model: string): Promise<AddMediaDTO>
}
