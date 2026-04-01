import { StorageService } from '@/core/StorageService'
import { StoreImageDTO } from '@shared/types'

export default class StoreImage {
  constructor(private readonly storage: StorageService) {}

  async execute(args: StoreImageDTO) {
    return this.storage.storeImage(args)
  }
}
