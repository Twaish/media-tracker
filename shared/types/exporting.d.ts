import { ImportResult } from '@/application/exporting/IImportManager'

export interface ExportingContext {
  exportLibrary(path: string): Promise<void>
  importLibrary(path: string): Promise<ImportResult>
}
