import { os } from '@orpc/server'

import { Modules } from '@/helpers/ipc/types'
import { createStorageUseCases } from '../usecases'

import {
  exportImagesInputSchema,
  storedImageResultSchema,
  storeImageInputSchema,
} from './schemas'

export * from './storage-channels'
export * from './storage-listeners'

export function createStorageRouters(modules: Modules) {
  const useCases = createStorageUseCases(modules)

  return {
    storeImage: os
      .input(storeImageInputSchema)
      .output(storedImageResultSchema)
      .handler(({ input }) => useCases.storeImage.execute(input)),
    exportImages: os
      .input(exportImagesInputSchema)
      .handler(({ input }) => useCases.exportImages.execute(input)),
  }
}
