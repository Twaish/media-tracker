import { Modules } from '@/helpers/ipc/types'
import { os } from '@orpc/server'
import { createWatchPlanUseCases } from '../usecases'
import {
  addWatchPlanInputSchema,
  getWatchPlansOutputSchema,
  persistedWatchPlanSchema,
  removeWatchPlansInputSchema,
  removeWatchPlansOutputSchema,
  updateWatchPlanInputSchema,
} from './schemas'

export function createWatchPlanRouters(modules: Modules) {
  const useCases = createWatchPlanUseCases(modules)

  return {
    get: os
      .output(getWatchPlansOutputSchema)
      .handler(() => useCases.getWatchPlans.execute()),
    add: os
      .input(addWatchPlanInputSchema)
      .output(persistedWatchPlanSchema)
      .handler(({ input }) => useCases.addWatchPlan.execute(input)),
    remove: os
      .input(removeWatchPlansInputSchema)
      .output(removeWatchPlansOutputSchema)
      .handler(({ input }) => useCases.removeWatchPlans.execute(input)),
    update: os
      .input(updateWatchPlanInputSchema)
      .output(persistedWatchPlanSchema)
      .handler(({ input }) => useCases.updateWatchPlan.execute(input)),
  }
}
