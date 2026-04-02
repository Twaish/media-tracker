import { exposeAiContext } from '@/features/ai/ipc/ai-context'
import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'
import { exposeExportingContext } from '@/features/exporting/ipc/exporting-context'

export default function exposeContexts() {
  exposeAiContext()
  exposeAutomationContext()
  exposeExportingContext()
}
