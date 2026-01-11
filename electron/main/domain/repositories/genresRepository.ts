import { Genre } from '../entities/genre'

export interface GenresRepository {
  get(): Promise<Genre[]>
}
