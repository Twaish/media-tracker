import { Modules } from '@/helpers/ipc/types'
import { exportSchemaV1 } from '../features/exporting/schemas/v1/exportSchema'

const exporting = {
  v1: exportSchemaV1,
}

export function registerExportSchemas(
  modules: Modules,
  version: keyof typeof exporting = 'v1',
) {
  const { ExportManager } = modules
  const schemas = exporting[version](modules)

  ExportManager.addExportSchemas(schemas)
}
