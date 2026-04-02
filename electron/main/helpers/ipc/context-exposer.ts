import { exposeAiContext } from '@/features/ai/ipc/ai-context'
import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'

export default function exposeContexts() {
  exposeAiContext()
  exposeAutomationContext()
}
