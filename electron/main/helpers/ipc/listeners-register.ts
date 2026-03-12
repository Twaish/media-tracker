import { Modules } from './types'
import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'
import { addGenresEventListeners } from './genres/genres-listeners'
import { addMediaEventListeners } from './media/media-listeners'
import { addStorageEventListeners } from './storage/storage-listeners'
import { addAiEventListeners } from './ai/ai-listeners'
import { addTasksEventListeners } from './tasks/tasks-listeners'
import { addWatchPlansEventListeners } from './watchPlans/watch-plans-listeners'
import { addAutomationEventListeners } from './automation/automation-listeners'
import { addExportingEventListeners } from './exporting/exporting-listeners'

export default function registerListeners(modules: Modules) {
  addWindowEventListeners(modules)
  addThemeEventListeners()
  addGenresEventListeners(modules)
  addMediaEventListeners(modules)
  addStorageEventListeners(modules)
  addAiEventListeners(modules)
  addTasksEventListeners(modules)
  addWatchPlansEventListeners(modules)
  addAutomationEventListeners(modules)
  addExportingEventListeners(modules)
}
