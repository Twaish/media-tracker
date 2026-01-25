import { ipcMain } from 'electron'
import { Modules } from '../types'
import { STORAGE_IMAGE } from './storage-channels'
import { StoreImageOptions } from '@shared/types'
import { createStorageUseCases } from '@/usecases/storage'

export function addStorageEventListeners(modules: Modules) {
  const useCases = createStorageUseCases(modules)

  ipcMain.handle(
    STORAGE_IMAGE,
    (_, imagePath: string, options: StoreImageOptions) => {
      return useCases.storeImage.execute(imagePath, options)
    },
  )
}
