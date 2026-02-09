import { exposeAiContext } from './ai/ai-context'
import { exposeGenresContext } from './genres/genres-context'
import { exposeMediaContext } from './media/media-context'
import { exposeSearchContext } from './search/search-context'
import { exposeStorageContext } from './storage/storage-context'
import { exposeThemeContext } from './theme/theme-context'
import { exposeWindowContext } from './window/window-context'

export default function exposeContexts() {
  exposeWindowContext()
  exposeThemeContext()
  exposeGenresContext()
  exposeMediaContext()
  exposeStorageContext()
  exposeAiContext()
  exposeSearchContext()
}
