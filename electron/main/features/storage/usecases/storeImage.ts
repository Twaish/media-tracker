import { StorageService } from '@/core/StorageService'
import { StoreImageOptions } from '@shared/types'

export default class StoreImage {
  constructor(private readonly storage: StorageService) {}

  async execute(imagePath: string, options: StoreImageOptions) {
    return this.storage.storeImage(imagePath, options)
  }
}
