import { GenreProps } from '../../domain/entities/genre'

export type AddGenreDTO = Omit<GenreProps, 'isDeletable'>
