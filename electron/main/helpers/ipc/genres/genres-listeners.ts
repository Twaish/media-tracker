import { ipcMain } from 'electron'
import { GENRES_GET } from './genres-channels'
import { Modules } from '../types'
import { createGenresUseCases } from '@/usecases/genres'

export function addGenresEventListeners(modules: Modules) {
  const useCases = createGenresUseCases(modules)

  ipcMain.handle(GENRES_GET, () => {
    return useCases.findAllGenres.execute()
  })
}
