import { Modules } from '@/helpers/ipc/types'
import GetGenres from './getGenres'

export function createGenresUseCases({ GenresRepository }: Modules) {
  return {
    getGenres: new GetGenres(GenresRepository),
  }
}
