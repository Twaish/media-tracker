import { exposeAiContext } from '@/features/ai/ipc/ai-context'
import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'
import { exposeExportingContext } from '@/features/exporting/ipc/exporting-context'
import { exposeGenresContext } from '@/features/genres/ipc/genres-context'
import { exposeMediaContext } from '@/features/media/ipc/media-context'
import { exposeTasksContext } from '@/features/tasks/ipc/tasks-context'

export default function exposeContexts() {
  exposeGenresContext()
  exposeMediaContext()
  exposeAiContext()
  exposeTasksContext()
  exposeAutomationContext()
  exposeExportingContext()
}
