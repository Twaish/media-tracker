import { exposeAiContext } from '@/features/ai/ipc/ai-context'
import { exposeAutomationContext } from '@/features/automation/ipc/automation-context'
import { exposeExportingContext } from '@/features/exporting/ipc/exporting-context'
import { exposeGenresContext } from '@/features/genres/ipc/genres-context'
import { exposeMediaContext } from '@/features/media/ipc/media-context'
import { exposeStorageContext } from '@/features/storage/ipc/storage-context'
import { exposeTasksContext } from '@/features/tasks/ipc/tasks-context'
import { exposeThemeContext } from '@/features/theme/ipc/theme-context'
import { exposeWatchPlansContext } from '@/features/watchplan/ipc/watch-plans-context'
import { exposeWindowContext } from '@/features/window/ipc/window-context'

export default function exposeContexts() {
  exposeWindowContext()
  exposeThemeContext()
  exposeGenresContext()
  exposeMediaContext()
  exposeStorageContext()
  exposeAiContext()
  exposeTasksContext()
  exposeWatchPlansContext()
  exposeAutomationContext()
  exposeExportingContext()
}
