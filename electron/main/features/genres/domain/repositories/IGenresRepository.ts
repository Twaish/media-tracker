import { AddGenreDTO } from '../../application/dto/genreDto'
import { PersistedGenre } from '../entities/genre'

export interface IGenresRepository {
  add(genre: AddGenreDTO): Promise<PersistedGenre>
  get(): Promise<PersistedGenre[]>
  getById(genreId: number): Promise<PersistedGenre>
  streamAll(batchSize?: number): AsyncIterable<PersistedGenre>
}
