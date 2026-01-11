import { mediaTable } from '@/db/tables/media.table'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Media = InferSelectModel<typeof mediaTable>
export type MediaCreateInput = InferInsertModel<typeof mediaTable>
export type MediaUpdateInput = Partial<InferInsertModel<typeof mediaTable>>

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
}
