import { GenreProps, PersistedGenre } from '@/domain/entities/genre'

export type AddGenreDTO = Omit<GenreProps, 'isDeletable'>

export interface GenresContext {
  get(): Promise<PersistedGenre[]>
  add(genre: AddGenreDTO): Promise<PersistedGenre>
}
