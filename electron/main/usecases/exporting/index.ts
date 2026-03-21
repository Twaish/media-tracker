import { Modules } from '@/helpers/ipc/types'
import ExportLibrary from './exportLibrary'
import ImportLibrary from './importLibrary'

export function createExportingUseCases({
  ExportManager,
  ImportManager,
}: Modules) {
  return {
    exportLibrary: new ExportLibrary(ExportManager),
    importLibrary: new ImportLibrary(ImportManager),
  }
}
