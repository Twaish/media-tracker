import { Modules } from './types'
import { addThemeEventListeners } from '@/features/theme/ipc/theme-listeners'
import { addGenresEventListeners } from '@/features/genres/ipc/genres-listeners'
import { addMediaEventListeners } from '@/features/media/ipc/media-listeners'
import { addAiEventListeners } from '@/features/ai/ipc/ai-listeners'
import { addTasksEventListeners } from '@/features/tasks/ipc/tasks-listeners'
import { addWatchPlansEventListeners } from '@/features/watchplan/ipc/watch-plans-listeners'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'
import { addExportingEventListeners } from '@/features/exporting/ipc/exporting-listeners'

export default function registerListeners(modules: Modules) {
  addThemeEventListeners()
  addGenresEventListeners(modules)
  addMediaEventListeners(modules)
  addAiEventListeners(modules)
  addTasksEventListeners(modules)
  addWatchPlansEventListeners(modules)
  addAutomationEventListeners(modules)
  addExportingEventListeners(modules)
}
