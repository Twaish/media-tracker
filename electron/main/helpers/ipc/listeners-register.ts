import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'
import { addNotesEventListeners } from './notes/notes-listeners'
import { addGenresEventListeners } from './genres/genres-listeners'
import { Modules } from './types'
import { addMediaEventListeners } from './media/media-listeners'

export default function registerListeners(modules: Modules) {
  addWindowEventListeners(modules)
  addThemeEventListeners()
  addNotesEventListeners(modules)
  addGenresEventListeners(modules)
  addMediaEventListeners(modules)
}
