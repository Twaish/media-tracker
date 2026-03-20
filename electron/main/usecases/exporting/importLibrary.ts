import { ImportManager } from '@/infrastructure/exporting/ImportManager'

export default class ImportLibrary {
  constructor(private readonly importManager: ImportManager) {}

  async execute(path: string) {
    return this.importManager.import(path)
  }
}
