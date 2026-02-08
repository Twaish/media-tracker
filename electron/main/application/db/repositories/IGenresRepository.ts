import { Genre } from '@/domain/entities/genre'

export interface IGenresRepository {
  get(): Promise<Genre[]>
}
