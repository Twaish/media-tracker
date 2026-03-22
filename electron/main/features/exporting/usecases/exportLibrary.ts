import { IExportManager } from '../application/interfaces/IExportManager'

export default class ExportLibrary {
  constructor(private readonly exportManager: IExportManager) {}

  async execute(path: string) {
    return this.exportManager.export(path)
  }
}
