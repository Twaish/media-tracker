import { exposeAiContext } from '@/features/ai/ipc/ai-context'
import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'
import { exposeExportingContext } from '@/features/exporting/ipc/exporting-context'
import { exposeGenresContext } from '@/features/genres/ipc/genres-context'

export default function exposeContexts() {
  exposeGenresContext()
  exposeAiContext()
  exposeAutomationContext()
  exposeExportingContext()
}
