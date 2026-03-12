import { Modules } from '@/helpers/ipc/types'
import StoreImage from './storeImage'
import ExportImages from './exportImages'

export function createStorageUseCases({ StorageService }: Modules) {
  return {
    storeImage: new StoreImage(StorageService),
    exportImages: new ExportImages(StorageService),
  }
}
