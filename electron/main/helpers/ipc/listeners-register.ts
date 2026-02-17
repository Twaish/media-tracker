import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'
import { addGenresEventListeners } from './genres/genres-listeners'
import { Modules } from './types'
import { addMediaEventListeners } from './media/media-listeners'
import { addStorageEventListeners } from './storage/storage-listeners'
import { addAiEventListeners } from './ai/ai-listeners'

export default function registerListeners(modules: Modules) {
  addWindowEventListeners(modules)
  addThemeEventListeners()
  addGenresEventListeners(modules)
  addMediaEventListeners(modules)
  addStorageEventListeners(modules)
  addAiEventListeners(modules)
}
