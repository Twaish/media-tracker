import { GenresRepositoryDrizzle } from '@/db/repositories/genresRepositoryDrizzle'
import { Modules } from '@/helpers/ipc/types'
import FindAllGenres from './findAllGenres'

export function createGenresUseCases({ Database }: Modules) {
  const repo = new GenresRepositoryDrizzle(Database)

  return {
    findAllGenres: new FindAllGenres(repo),
  }
}
