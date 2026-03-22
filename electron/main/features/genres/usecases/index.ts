import { Modules } from '@/helpers/ipc/types'
import GetGenres from './getGenres'
import AddGenre from './addGenre'
import GetGenreById from './getGenreById'

export function createGenresUseCases({ GenresRepository }: Modules) {
  return {
    getGenres: new GetGenres(GenresRepository),
    addGenre: new AddGenre(GenresRepository),
    getGenreById: new GetGenreById(GenresRepository),
  }
}
