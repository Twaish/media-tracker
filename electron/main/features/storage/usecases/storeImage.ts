import { StoreImageDTO } from '../application/dto/storage.dto'
import { IStorageService } from '../application/interfaces/IStorageService'

export default class StoreImage {
  constructor(private readonly storage: IStorageService) {}

  async execute(args: StoreImageDTO) {
    return this.storage.storeImage(args)
  }
}
