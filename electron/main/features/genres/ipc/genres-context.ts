import { AddGenreDTO, GenresContext } from '@shared/types'
import { GENRES_ADD, GENRES_GET, GENRES_GET_BY_ID } from './genres-channels'

export function exposeGenresContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('genres', {
    get: () => ipcRenderer.invoke(GENRES_GET),
    add: (genre: AddGenreDTO) => ipcRenderer.invoke(GENRES_ADD, genre),
    getById: (genreId: number) => ipcRenderer.invoke(GENRES_GET_BY_ID, genreId),
  } satisfies GenresContext)
}
