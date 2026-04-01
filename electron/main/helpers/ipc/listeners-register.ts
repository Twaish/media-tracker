import { Modules } from './types'
import { addGenresEventListeners } from '@/features/genres/ipc/genres-listeners'
import { addMediaEventListeners } from '@/features/media/ipc/media-listeners'
import { addAiEventListeners } from '@/features/ai/ipc/ai-listeners'
import { addTasksEventListeners } from '@/features/tasks/ipc/tasks-listeners'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'
import { addExportingEventListeners } from '@/features/exporting/ipc/exporting-listeners'

export default function registerListeners(modules: Modules) {
  addGenresEventListeners(modules)
  addMediaEventListeners(modules)
  addAiEventListeners(modules)
  addTasksEventListeners(modules)
  addAutomationEventListeners(modules)
  addExportingEventListeners(modules)
}
