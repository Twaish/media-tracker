import { Modules } from './types'

import { createThemeRouters } from '../../app/theme/ipc'
import { createTasksRouters } from '../../app/tasks/ipc'
import { createWindowRouters } from '../../app/window/ipc'
import { createEventsRouters } from '../../app/events/ipc'
import { createStorageRouters } from '../../app/storage/ipc'
import { createExportingRouters } from '../../app/exporting/ipc'

import { createAiRouters } from '../../features/ai/ipc'
import { createMediaRouters } from '../../features/media/ipc'
import { createGenresRouters } from '../../features/genres/ipc'
import { createWatchPlanRouters } from '../../features/watchplan/ipc'
import { createAutomationRouters } from '../../features/automation/ipc'

export function createOrpcRouter(modules: Modules) {
  return {
    themeMode: createThemeRouters(),
    tasks: createTasksRouters(modules),
    electronWindow: createWindowRouters(modules),
    events: createEventsRouters(modules),
    storage: createStorageRouters(modules),
    exporting: createExportingRouters(modules),

    ai: createAiRouters(modules),
    media: createMediaRouters(modules),
    genres: createGenresRouters(modules),
    watchPlans: createWatchPlanRouters(modules),
    automation: createAutomationRouters(modules),
  }
}
