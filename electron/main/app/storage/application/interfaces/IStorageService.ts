import { StoredImageResultDTO, StoreImageDTO } from '../dto/storage.dto'

export interface IStorageService {
  resolve(relativePath: string): string
  storeImage(args: StoreImageDTO): Promise<StoredImageResultDTO>
  exportImages(destinationPath: string): void
}
