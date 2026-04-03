import { IImportManager } from '../application/interfaces/IImportManager'

export default class ImportLibrary {
  constructor(private readonly importManager: IImportManager) {}

  async execute(path: string) {
    return this.importManager.import(path)
  }
}
