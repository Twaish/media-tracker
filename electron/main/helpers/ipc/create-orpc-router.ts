import { Modules } from './types'
import { createWindowRouters } from '../../features/window/ipc'
import { createStorageRouters } from '../../features/storage/ipc'
import { createThemeRouters } from '../../features/theme/ipc'
import { createWatchPlanRouters } from '../../features/watchplan/ipc'
import { createTasksRouters } from '../../features/tasks/ipc'

export function createOrpcRouter(modules: Modules) {
  return {
    storage: createStorageRouters(modules),
    electronWindow: createWindowRouters(modules),
    themeMode: createThemeRouters(),
    watchPlans: createWatchPlanRouters(modules),
    tasks: createTasksRouters(modules),
  }
}
