import { Genre } from '../entities/genre'

export interface GenresRepository {
  findAll(): Promise<Genre[]>
}
