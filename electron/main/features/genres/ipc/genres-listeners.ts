import { GenresContext } from '@shared/types'
import { GENRES_ADD, GENRES_GET, GENRES_GET_BY_ID } from './genres-channels'
import { createGenresUseCases } from '../usecases'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

export function addGenresEventListeners(modules: Modules) {
  const useCases = createGenresUseCases(modules)

  registerIpcHandlers<GenresContext>({
    get: [GENRES_GET, () => useCases.getGenres.execute()],
    add: [GENRES_ADD, (_event, genre) => useCases.addGenre.execute(genre)],
    getById: [
      GENRES_GET_BY_ID,
      (_event, genreId) => useCases.getGenreById.execute(genreId),
    ],
  })
}
