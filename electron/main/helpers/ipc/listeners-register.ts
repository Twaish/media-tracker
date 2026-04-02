import { Modules } from './types'
import { addAiEventListeners } from '@/features/ai/ipc/ai-listeners'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'
import { addExportingEventListeners } from '@/features/exporting/ipc/exporting-listeners'

export default function registerListeners(modules: Modules) {
  addAiEventListeners(modules)
  addAutomationEventListeners(modules)
  addExportingEventListeners(modules)
}
