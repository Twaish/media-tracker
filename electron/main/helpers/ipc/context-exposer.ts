import { exposeGenresContext } from './genres/genres-context'
import { exposeMediaContext } from './media/media-context'
import { exposeNotesContext } from './notes/notes-context'
import { exposeStorageContext } from './storage/storage-context'
import { exposeThemeContext } from './theme/theme-context'
import { exposeWindowContext } from './window/window-context'

export default function exposeContexts() {
  exposeWindowContext()
  exposeThemeContext()
  exposeNotesContext()
  exposeGenresContext()
  exposeMediaContext()
  exposeStorageContext()
}
