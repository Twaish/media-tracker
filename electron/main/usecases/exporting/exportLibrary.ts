import { ExportManager } from '@/infrastructure/exporting/ExportManager'

export default class ExportLibrary {
  constructor(private readonly exportManager: ExportManager) {}

  async execute(path: string) {
    return this.exportManager.export(path)
  }
}
