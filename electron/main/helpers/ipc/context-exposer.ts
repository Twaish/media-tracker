import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'

export default function exposeContexts() {
  exposeAutomationContext()
}
