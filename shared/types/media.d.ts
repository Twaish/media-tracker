import { mediaTable } from '@/infrastructure/db/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Media = InferSelectModel<typeof mediaTable>
export type MediaCreateInput = InferInsertModel<typeof mediaTable> & {
  genres: number[]
}
export type MediaUpdateInput = Partial<
  Omit<MediaCreateInput, 'id' | 'createdAt'>
> & { id: number }

export interface MediaPaginationOptions {
  page: number
  limit: number
}

export interface MediaGenresInput {
  mediaId: number
  genreIds: number[]
}

export interface MediaContext {
  get: (options: MediaPaginationOptions) => Promise<Media[]>
  add: (media: MediaCreateInput) => Promise<Media>
  remove: (mediaIds: number[]) => Promise<void>
  update: (media: MediaUpdateInput) => Promise<Media>
  setNextMedia: (mediaId: number, nextMediaId: number) => Promise<void>
}
