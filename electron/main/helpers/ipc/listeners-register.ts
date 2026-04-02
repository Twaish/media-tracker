import { Modules } from './types'
import { addAutomationEventListeners } from '@/features/automation/ipc/automation-listeners'

export default function registerListeners(modules: Modules) {
  addAutomationEventListeners(modules)
}
