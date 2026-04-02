import { Modules } from '@/helpers/ipc/types'
import { createExportingUseCases } from '../usecases'
import { os } from '@orpc/server'
import { exportLibraryInputSchema, importLibraryInputSchema } from './schemas'

export function createExportingRouters(modules: Modules) {
  const useCases = createExportingUseCases(modules)

  return {
    exportLibrary: os
      .input(exportLibraryInputSchema)
      .handler(({ input }) => useCases.exportLibrary.execute(input)),
    importLibrary: os
      .input(importLibraryInputSchema)
      .handler(({ input }) => useCases.importLibrary.execute(input)),
  }
}
