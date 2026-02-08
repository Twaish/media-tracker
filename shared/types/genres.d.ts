import { genresTable } from '@/infrastructure/db/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Genre = InferSelectModel<typeof genresTable>
export type GenreCreateInput = InferInsertModel<typeof genresTable>

export interface GenresContext {
  get: () => Promise<Genre[]>
}
