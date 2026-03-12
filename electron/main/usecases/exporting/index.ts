import { Modules } from '@/helpers/ipc/types'
import ExportLibrary from './exportLibrary'

export function createExportingUseCases({ ExportManager }: Modules) {
  return {
    exportLibrary: new ExportLibrary(ExportManager),
  }
}
