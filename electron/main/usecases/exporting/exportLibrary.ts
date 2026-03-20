import { IExportManager } from '@/application/exporting/IExportManager'

export default class ExportLibrary {
  constructor(private readonly exportManager: IExportManager) {}

  async execute(path: string) {
    return this.exportManager.export(path)
  }
}
