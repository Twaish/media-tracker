import { Modules } from '../types'
import { STORAGE_IMAGE } from './storage-channels'
import { StorageContext } from '@shared/types'
import { createStorageUseCases } from '@/usecases/storage'
import { registerIpcHandlers } from '../register-ipc-handlers'

export function addStorageEventListeners(modules: Modules) {
  const useCases = createStorageUseCases(modules)

  registerIpcHandlers<StorageContext>({
    storeImage: [
      STORAGE_IMAGE,
      (_, imagePath, options) =>
        useCases.storeImage.execute(imagePath, options),
    ],
  })
}
