import {
  ExportSchema,
  IExportManager,
} from '@/application/exporting/IExportManager'
import path from 'path'

export class ExportManager implements IExportManager {
  constructor(private exportSchemas: ExportSchema[] = []) {}

  addExportSchema(exportSchema: ExportSchema): void {
    this.exportSchemas.push(exportSchema)
  }

  export(dest: string): void {
    this.exportSchemas.forEach((schema) =>
      schema.callback(path.join(dest, schema.path)),
    )
  }
}
