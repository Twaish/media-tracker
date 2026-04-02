import { StorageService } from '@/core/StorageService'
import { StoreImageDTO } from '../application/dto/storage.dto'

export default class StoreImage {
  constructor(private readonly storage: StorageService) {}

  async execute(args: StoreImageDTO) {
    return this.storage.storeImage(args)
  }
}
