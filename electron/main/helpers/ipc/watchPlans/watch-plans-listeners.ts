import { Modules } from '../types'
import {
  WATCH_PLAN_ADD,
  WATCH_PLAN_GET,
  WATCH_PLAN_REMOVE,
  WATCH_PLAN_UPDATE,
} from './watch-plans-channels'
import { WatchPlansContext } from '@shared/types/watchPlans'
import { createWatchPlanUseCases } from '@/usecases/watchplan'
import { registerIpcHandlers } from '../register-ipc-handlers'

export function addWatchPlansEventListeners(modules: Modules) {
  const useCases = createWatchPlanUseCases(modules)

  registerIpcHandlers<WatchPlansContext>({
    get: [WATCH_PLAN_GET, () => useCases.getWatchPlans.execute()],
    add: [
      WATCH_PLAN_ADD,
      (_, watchPlan) => useCases.addWatchPlan.execute(watchPlan),
    ],
    remove: [
      WATCH_PLAN_REMOVE,
      (_, ids) => useCases.removeWatchPlans.execute(ids),
    ],
    update: [
      WATCH_PLAN_UPDATE,
      (_, watchPlan) => useCases.updateWatchPlan.execute(watchPlan),
    ],
  })
}
