import { GenresContext } from '@shared/types'
import { GENRES_GET } from './genres-channels'

export function exposeGenresContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('genres', {
    get: () => ipcRenderer.invoke(GENRES_GET),
  } satisfies GenresContext)
}
