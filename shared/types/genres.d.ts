import { PersistedGenre } from '@/domain/entities/genre'

export interface GenresContext {
  get: () => Promise<PersistedGenre[]>
}
