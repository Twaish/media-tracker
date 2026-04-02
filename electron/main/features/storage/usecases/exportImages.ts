import { IStorageService } from '../application/interfaces/IStorageService'

export default class ExportImages {
  constructor(private readonly storage: IStorageService) {}

  async execute(destinationPath: string) {
    return this.storage.exportImages(destinationPath)
  }
}
