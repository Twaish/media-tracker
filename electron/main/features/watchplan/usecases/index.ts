import { Modules } from '@/helpers/ipc/types'
import AddWatchPlan from './addWatchPlan'
import GetWatchPlans from './getWatchPlans'
import RemoveWatchPlans from './removeWatchPlans'
import UpdateWatchPlan from './updateWatchPlan'

export function createWatchPlanUseCases({ WatchPlanRepository }: Modules) {
  return {
    addWatchPlan: new AddWatchPlan(WatchPlanRepository),
    getWatchPlans: new GetWatchPlans(WatchPlanRepository),
    removeWatchPlans: new RemoveWatchPlans(WatchPlanRepository),
    updateWatchPlan: new UpdateWatchPlan(WatchPlanRepository),
  }
}
