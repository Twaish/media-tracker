import { Modules } from '../ipc/types'
import { exportSchemaV1 } from './schemas/v1'

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
