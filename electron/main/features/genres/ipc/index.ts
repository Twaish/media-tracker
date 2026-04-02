import { Modules } from '@/helpers/ipc/types'
import { createGenresUseCases } from '../usecases'
import { os } from '@orpc/server'
import {
  addInputSchema,
  getByIdInputSchema,
  getOutputSchema,
  persistedGenreSchema,
} from './schemas'

export function createGenresRouters(modules: Modules) {
  const useCases = createGenresUseCases(modules)

  return {
    get: os.output(getOutputSchema).handler(() => useCases.getGenres.execute()),
    add: os
      .input(addInputSchema)
      .output(persistedGenreSchema)
      .handler(({ input }) => useCases.addGenre.execute(input)),
    getById: os
      .input(getByIdInputSchema)
      .output(persistedGenreSchema)
      .handler(({ input }) => useCases.getGenreById.execute(input)),
  }
}
