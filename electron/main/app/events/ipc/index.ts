import { os } from '@orpc/server'
import { Modules } from '@/helpers/ipc/types'
import { createEventsUseCases } from '../usecases'
import { getOutputSchema } from './schemas'

export function createEventsRouters(modules: Modules) {
  const useCases = createEventsUseCases(modules)

  return {
    get: os
      .output(getOutputSchema)
      .handler(() => useCases.getEventDefinitions.execute()),
  }
}
