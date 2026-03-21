import { Modules } from '../ipc/types'
import { importSchemaV1 } from './schemas/v1'

const importing = {
  v1: importSchemaV1,
}

export function registerImportSchemas(
  modules: Modules,
  version: keyof typeof importing = 'v1',
) {
  const { ImportManager } = modules
  const schemas = importing[version](modules)

  ImportManager.addImportSchemas(schemas)
}
