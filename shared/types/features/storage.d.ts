export { StoreImageDTO } from '@/features/storage/application/dto/storeImage.dto'
export { StoredImageResultDTO } from '@/features/storage/application/dto/storedImageResult.dto'

import { StoreImageDTO } from './storage'
import { StoredImageResultDTO } from './storage'

export interface StorageContext {
  storeImage(args: StoreImageDTO): Promise<StoredImageResultDTO>
  exportImages(destinationPath: string): Promise<void>
}
