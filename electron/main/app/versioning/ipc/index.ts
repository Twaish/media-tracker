import { os } from '@orpc/server'

import { Modules } from '@/helpers/ipc/types'
import { createVersioningUseCases } from '../usecases'
import {
  getInputSchema,
  getOutputSchema,
  removeInputSchema,
  removeOutputSchema,
} from './schemas'

export function createVersioningRouters(modules: Modules) {
  const useCases = createVersioningUseCases(modules)

  return {
    get: os
      .input(getInputSchema)
      .output(getOutputSchema)
      .handler(({ input }) => useCases.getDeltas.execute(input)),
    remove: os
      .input(removeInputSchema)
      .output(removeOutputSchema)
      .handler(({ input }) => useCases.removeDeltas.execute(input)),
  }
}
