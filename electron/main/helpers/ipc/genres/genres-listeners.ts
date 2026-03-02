import { GENRES_GET } from './genres-channels'
import { Modules } from '../types'
import { createGenresUseCases } from '@/usecases/genres'
import { registerIpcHandlers } from '../register-ipc-handlers'
import { GenresContext } from '@shared/types'

export function addGenresEventListeners(modules: Modules) {
  const useCases = createGenresUseCases(modules)

  registerIpcHandlers<GenresContext>({
    get: [GENRES_GET, () => useCases.getGenres.execute()],
  })
}
