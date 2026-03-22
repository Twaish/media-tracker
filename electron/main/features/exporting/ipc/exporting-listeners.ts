import { ExportingContext } from '@shared/types/exporting'
import {
  EXPORTING_IMPORT_LIBRARY,
  EXPORTING_LIBRARY,
} from './exporting-channels'
import { createExportingUseCases } from '../usecases'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

export function addExportingEventListeners(modules: Modules) {
  const useCases = createExportingUseCases(modules)

  registerIpcHandlers<ExportingContext>({
    exportLibrary: [
      EXPORTING_LIBRARY,
      (_, path) => useCases.exportLibrary.execute(path),
    ],
    importLibrary: [
      EXPORTING_IMPORT_LIBRARY,
      (_, path) => useCases.importLibrary.execute(path),
    ],
  })
}
