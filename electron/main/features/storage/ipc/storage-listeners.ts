import { Modules } from '@/helpers/ipc/types'
import { STORAGE_EXPORT_IMAGES, STORAGE_IMAGE } from './storage-channels'
import { StorageContext } from '@shared/types'
import { createStorageUseCases } from '@/features/storage/usecases'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

export function addStorageEventListeners(modules: Modules) {
  const useCases = createStorageUseCases(modules)

  registerIpcHandlers<StorageContext>({
    storeImage: [
      STORAGE_IMAGE,
      (_, imagePath, options) =>
        useCases.storeImage.execute(imagePath, options),
    ],
    exportImages: [
      STORAGE_EXPORT_IMAGES,
      (_, destinationPath) => useCases.exportImages.execute(destinationPath),
    ],
  })
}
