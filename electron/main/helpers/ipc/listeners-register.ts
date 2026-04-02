import { Modules } from './types'
import { addAiEventListeners } from '@/features/ai/ipc/ai-listeners'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'

export default function registerListeners(modules: Modules) {
  addAiEventListeners(modules)
  addAutomationEventListeners(modules)
}
