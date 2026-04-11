import { Modules } from './types'

import { createThemeRouters } from '../../app/theme/ipc'
import { createTasksRouters } from '../../app/tasks/ipc'
import { createWindowRouters } from '../../app/window/ipc'
import { createEventsRouters } from '../../app/events/ipc'
import { createStorageRouters } from '../../app/storage/ipc'
import { createExportingRouters } from '../../app/exporting/ipc'
import { createVersioningRouters } from '../../app/versioning/ipc'

import { createAiRouters } from '../../features/ai/ipc'
import { createMediaRouters } from '../../features/media/ipc'
import { createGenresRouters } from '../../features/genres/ipc'
import { createWatchPlanRouters } from '../../features/watchplan/ipc'
import { createAutomationRouters } from '../../features/automation/ipc'
import { createIndexingRouters } from '@/app/indexing/ipc'

export function createOrpcRouter(modules: Modules) {
  return {
    themeMode: createThemeRouters(),
    tasks: createTasksRouters(modules),
    electronWindow: createWindowRouters(modules),
    events: createEventsRouters(modules),
    storage: createStorageRouters(modules),
    indexing: createIndexingRouters(modules),
    exporting: createExportingRouters(modules),
    versioning: createVersioningRouters(modules),

    ai: createAiRouters(modules),
    media: createMediaRouters(modules),
    genres: createGenresRouters(modules),
    watchPlans: createWatchPlanRouters(modules),
    automation: createAutomationRouters(modules),
  }
}
