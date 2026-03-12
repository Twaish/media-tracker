import { createExportingUseCases } from '@/usecases/exporting'
import { Modules } from '../types'
import { registerIpcHandlers } from '../register-ipc-handlers'
import { ExportingContext } from '@shared/types/exporting'
import { EXPORTING_LIBRARY } from './exporting-channels'

export function addExportingEventListeners(modules: Modules) {
  const useCases = createExportingUseCases(modules)

  registerIpcHandlers<ExportingContext>({
    exportLibrary: [
      EXPORTING_LIBRARY,
      (_, path) => useCases.exportLibrary.execute(path),
    ],
  })
}
