import { ipcMain } from 'electron'
import { Modules } from '../types'
import {
  WATCH_PLAN_ADD,
  WATCH_PLAN_GET,
  WATCH_PLAN_REMOVE,
  WATCH_PLAN_UPDATE,
} from './watch-plans-channels'
import {
  WatchPlanCreateInput,
  WatchPlanUpdateInput,
} from '@shared/types/watchPlans'
import { createWatchPlanUseCases } from '@/usecases/watchplan'

export function addWatchPlansEventListeners(modules: Modules) {
  const useCases = createWatchPlanUseCases(modules)

  ipcMain.handle(WATCH_PLAN_GET, () => {
    return useCases.getWatchPlans.execute()
  })
  ipcMain.handle(WATCH_PLAN_ADD, (_, watchPlan: WatchPlanCreateInput) => {
    return useCases.addWatchPlan.execute(watchPlan)
  })
  ipcMain.handle(WATCH_PLAN_REMOVE, (_, ids: number[]) => {
    return useCases.removeWatchPlans.execute(ids)
  })
  ipcMain.handle(WATCH_PLAN_UPDATE, (_, watchPlan: WatchPlanUpdateInput) => {
    return useCases.updateWatchPlan.execute(watchPlan)
  })
}
