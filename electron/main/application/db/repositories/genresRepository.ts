import { Genre } from '@/domain/entities/genre'

export interface GenresRepository {
  get(): Promise<Genre[]>
}
