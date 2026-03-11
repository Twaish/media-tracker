import { PersistedGenre } from '@/domain/entities/genre'

export interface IGenresRepository {
  get(): Promise<PersistedGenre[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedGenre>
}
