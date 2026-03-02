import { MediaProps, PersistedMedia } from '@/domain/entities/media'
import { PersistedMediaEmbedding } from '@/domain/entities/mediaEmbedding'

export type AddMediaDTO = Omit<
  MediaProps,
  'genres' | 'createdAt' | 'lastUpdated' | 'deletedAt'
> & {
  genres: number[]
}
export type UpdateMediaDTO = Partial<AddMediaDTO> & {
  id: number
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

export interface MediaPaginationOptions {
  page: number
  limit: number
}

export type MediaPaginationResult = {
  data: PersistedMedia[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}

export interface MediaContext {
  get(options: MediaPaginationOptions): Promise<PersistedMedia[]>
  add(media: AddMediaDTO): Promise<PersistedMedia>
  remove(mediaIds: number[]): Promise<void>
  update(media: UpdateMediaDTO): Promise<PersistedMedia>
  setNextMedia(mediaId: number, nextMediaId: number): Promise<void>
  resolveExternalLink(mediaId: number): Promise<string | null>
  search(query: string): Promise<MediaPaginationResult>
  getById(mediaId: number): Promise<PersistedMedia>
  bulkUpdate(mediaUpdates: BulkUpdateMediaDTO): Promise<{ affected: 0 }>
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
}
