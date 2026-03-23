import { Modules } from '@/helpers/ipc/types'
import {
  WATCH_PLAN_ADD,
  WATCH_PLAN_GET,
  WATCH_PLAN_REMOVE,
  WATCH_PLAN_UPDATE,
} from './watch-plans-channels'
import { WatchPlansContext } from '@shared/types'
import { createWatchPlanUseCases } from '../usecases'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

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
