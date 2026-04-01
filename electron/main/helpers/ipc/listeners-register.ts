import { Modules } from './types'
import { addGenresEventListeners } from '@/features/genres/ipc/genres-listeners'
import { addAiEventListeners } from '@/features/ai/ipc/ai-listeners'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'
import { addExportingEventListeners } from '@/features/exporting/ipc/exporting-listeners'

export default function registerListeners(modules: Modules) {
  addGenresEventListeners(modules)
  addAiEventListeners(modules)
  addAutomationEventListeners(modules)
  addExportingEventListeners(modules)
}
