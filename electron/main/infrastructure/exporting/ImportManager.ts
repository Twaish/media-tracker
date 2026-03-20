import {
  IImportManager,
  ImportSchema,
} from '@/application/exporting/IImportManager'
import path from 'path'

export class ImportManager implements IImportManager {
  private schemas: ImportSchema[] = []

  addImportSchema(schema: ImportSchema) {
    this.schemas.push(schema)
  }

  addImportSchemas(schemas: ImportSchema[]) {
    this.schemas.push(...schemas)
  }

  async import(src: string): Promise<void> {
    const sortedSchemas = [...this.schemas].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    )

    sortedSchemas.forEach(async (schema) => {
      const schemaDest = path.join(src, schema.path)
      await schema.callback(schemaDest)
    })
  }
}
