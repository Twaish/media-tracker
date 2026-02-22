import {
  WatchPlanCreateInput,
  WatchPlansContext,
  WatchPlanUpdateInput,
} from '@shared/types/watchPlans'
import {
  WATCH_PLAN_ADD,
  WATCH_PLAN_GET,
  WATCH_PLAN_REMOVE,
  WATCH_PLAN_UPDATE,
} from './watch-plans-channels'

export function exposeWatchPlansContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: WatchPlansContext = {
    get() {
      return ipcRenderer.invoke(WATCH_PLAN_GET)
    },
    add(watchPlan: WatchPlanCreateInput) {
      return ipcRenderer.invoke(WATCH_PLAN_ADD, watchPlan)
    },
    remove(ids: number[]) {
      return ipcRenderer.invoke(WATCH_PLAN_REMOVE, ids)
    },
    update(watchPlan: WatchPlanUpdateInput) {
      return ipcRenderer.invoke(WATCH_PLAN_UPDATE, watchPlan)
    },
  }
  contextBridge.exposeInMainWorld('watchPlans', context)
}
