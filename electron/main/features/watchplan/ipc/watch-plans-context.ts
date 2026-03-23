import { WatchPlansContext } from '@shared/types'
import {
  WATCH_PLAN_ADD,
  WATCH_PLAN_GET,
  WATCH_PLAN_REMOVE,
  WATCH_PLAN_UPDATE,
} from './watch-plans-channels'

export function exposeWatchPlansContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('watchPlans', {
    get: () => ipcRenderer.invoke(WATCH_PLAN_GET),
    add: (watchPlan) => ipcRenderer.invoke(WATCH_PLAN_ADD, watchPlan),
    remove: (ids) => ipcRenderer.invoke(WATCH_PLAN_REMOVE, ids),
    update: (watchPlan) => ipcRenderer.invoke(WATCH_PLAN_UPDATE, watchPlan),
  } satisfies WatchPlansContext)
}
