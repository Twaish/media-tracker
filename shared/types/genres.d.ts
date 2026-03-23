import {
  PersistedGenre,
} from '@/features/genres/domain/entities/genre'

export type {
  AddGenreDTO,
} from '@/features/genres/application/dto/genreDto'

import type {
  AddGenreDTO,
} from '@/features/genres/application/dto/genreDto'

export interface GenresContext {
  get(): Promise<PersistedGenre[]>
  add(genre: AddGenreDTO): Promise<PersistedGenre>
  getById(genreId: number): Promise<PersistedGenre>
}
