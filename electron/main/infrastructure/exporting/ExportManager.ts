import {
  ExportSchema,
  IExportManager,
} from '@/application/exporting/IExportManager'
import path from 'path'
import fs from 'fs'

export class ExportManager implements IExportManager {
  constructor(private exportSchemas: ExportSchema[] = []) {}

  addExportSchema(exportSchema: ExportSchema): void {
    this.exportSchemas.push(exportSchema)
  }

  addExportSchemas(exportSchemas: ExportSchema[]): void {
    this.exportSchemas.push(...exportSchemas)
  }

  export(dest: string): void {
    fs.mkdirSync(dest, { recursive: true })

    this.exportSchemas.forEach((schema) => {
      const schemaDest = path.join(dest, schema.path)

      fs.mkdirSync(schemaDest, { recursive: true })

      schema.callback(schemaDest)
    })
  }
}
