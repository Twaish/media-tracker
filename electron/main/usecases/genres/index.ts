import { GenresRepositoryDrizzle } from '@/db/repositories/genresRepositoryDrizzle'
import { Modules } from '@/helpers/ipc/types'
import GetGenres from './getGenres'

export function createGenresUseCases({ Database }: Modules) {
  const repo = new GenresRepositoryDrizzle(Database)

  return {
    getGenres: new GetGenres(repo),
  }
}
