import { StorageService } from '@/core/StorageService'

export default class ExportImages {
  constructor(private readonly storage: StorageService) {}

  async execute(destinationPath: string) {
    return this.storage.exportImages(destinationPath)
  }
}
