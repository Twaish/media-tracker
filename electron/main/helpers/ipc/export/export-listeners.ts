import { createExportUseCases } from '@/usecases/export'
import { Modules } from '../types'
import { registerIpcHandlers } from '../register-ipc-handlers'
import { ExportContext } from '@shared/types/export'
import { EXPORT_LIBRARY } from './export-channels'

export function addExportEventListeners(modules: Modules) {
  const useCases = createExportUseCases(modules)

  registerIpcHandlers<ExportContext>({
    exportLibrary: [
      EXPORT_LIBRARY,
      (_, path) => useCases.exportLibrary.execute(path),
    ],
  })
}
