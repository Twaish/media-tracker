import { GenresContext } from '@shared/types'
import { GENRES_GET } from './genres-channels'

export function exposeGenresContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: GenresContext = {
    get: () => ipcRenderer.invoke(GENRES_GET),
  }
  contextBridge.exposeInMainWorld('genres', context)
}
