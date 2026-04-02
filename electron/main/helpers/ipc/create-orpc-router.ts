import { Modules } from './types'
import { createWindowRouters } from '../../features/window/ipc'
import { createStorageRouters } from '../../features/storage/ipc'
import { createThemeRouters } from '../../features/theme/ipc'
import { createWatchPlanRouters } from '../../features/watchplan/ipc'
import { createTasksRouters } from '../../features/tasks/ipc'
import { createMediaRouters } from '../../features/media/ipc'
import { createEventsRouters } from '../../features/events/ipc'
import { createGenresRouters } from '../../features/genres/ipc'
import { createExportingRouters } from '../../features/exporting/ipc'
import { createAiRouters } from '../../features/ai/ipc'
import { createAutomationRouters } from '../../features/automation/ipc'

export function createOrpcRouter(modules: Modules) {
  return {
    storage: createStorageRouters(modules),
    electronWindow: createWindowRouters(modules),
    themeMode: createThemeRouters(),
    watchPlans: createWatchPlanRouters(modules),
    tasks: createTasksRouters(modules),
    media: createMediaRouters(modules),
    events: createEventsRouters(modules),
    genres: createGenresRouters(modules),
    exporting: createExportingRouters(modules),
    ai: createAiRouters(modules),
    automation: createAutomationRouters(modules),
  }
}
