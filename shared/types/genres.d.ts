import {
  GenreProps,
  PersistedGenre,
} from '@/features/genres/domain/entities/genre'

export type AddGenreDTO = Omit<GenreProps, 'isDeletable'>

export interface GenresContext {
  get(): Promise<PersistedGenre[]>
  add(genre: AddGenreDTO): Promise<PersistedGenre>
  getById(genreId: number): Promise<PersistedGenre>
}
