import { PersistedGenre } from '@/domain/entities/genre'
import { AddGenreDTO } from '@shared/types'

export interface IGenresRepository {
  add(genre: AddGenreDTO): Promise<PersistedGenre>
  get(): Promise<PersistedGenre[]>
  getById(genreId: number): Promise<PersistedGenre>
  streamAll(batchSize?: number): AsyncIterable<PersistedGenre>
}
