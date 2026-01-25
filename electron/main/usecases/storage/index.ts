import { Modules } from '@/helpers/ipc/types'
import StoreImage from './storeImage'

export function createStorageUseCases({ StorageService }: Modules) {
  return {
    storeImage: new StoreImage(StorageService),
  }
}
