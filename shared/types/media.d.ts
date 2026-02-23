import { BulkUpdateMediaDTO } from '@/application/db/repositories/IMediaRepository'
import { MediaProps, PersistedMedia } from '@/domain/entities/media'
import { SearchQuery } from '@/domain/services/QueryResolver'

export type AddMediaDTO = Omit<
  MediaProps,
  'genres' | 'createdAt' | 'lastUpdated' | 'deletedAt'
> & {
  genres: number[]
}
export type UpdateMediaDTO = Partial<AddMediaDTO> & {
  id: number
}

export interface MediaPaginationOptions {
  page: number
  limit: number
}

export interface MediaContext {
  get: (options: MediaPaginationOptions) => Promise<PersistedMedia[]>
  add: (media: AddMediaDTO) => Promise<PersistedMedia>
  remove: (mediaIds: number[]) => Promise<void>
  update: (media: UpdateMediaDTO) => Promise<PersistedMedia>
  setNextMedia: (mediaId: number, nextMediaId: number) => Promise<void>
  resolveExternalLink: (mediaId: number) => Promise<string | null>
  search: (query: string) => Promise<SearchQuery>
  getById: (mediaId: number) => Promise<PersistedMedia>
  bulkUpdate: (mediaUpdates: BulkUpdateMediaDTO) => Promise<{ affected: 0 }>
}
