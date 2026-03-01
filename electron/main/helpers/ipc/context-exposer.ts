import { exposeAiContext } from './ai/ai-context'
import { exposeAutomationContext } from './automation/automation-context'
import { exposeGenresContext } from './genres/genres-context'
import { exposeMediaContext } from './media/media-context'
import { exposeStorageContext } from './storage/storage-context'
import { exposeTasksContext } from './tasks/tasks-context'
import { exposeThemeContext } from './theme/theme-context'
import { exposeWatchPlansContext } from './watchPlans/watch-plans-context'
import { exposeWindowContext } from './window/window-context'

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
}
