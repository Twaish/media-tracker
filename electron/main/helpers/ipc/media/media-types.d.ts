import { mediaTable } from '@/db/schema'
import { InferInsertModel } from 'drizzle-orm'

export interface MediaPaginationOptions {
  page: number
  limit: number
}

export type MediaCreateInput = InferInsertModel<typeof mediaTable>
export type MediaUpdateInput = Partial<InferInsertModel<typeof mediaTable>>
export type MediaGenresInput = {
  mediaId: number
  genreIds: number[]
}
