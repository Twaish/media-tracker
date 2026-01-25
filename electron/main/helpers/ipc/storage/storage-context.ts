import { StorageContext, StoreImageOptions } from '@shared/types'
import { STORAGE_IMAGE } from './storage-channels'

export function exposeStorageContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const storage: StorageContext = {
    storeImage(imagePath: string, options: StoreImageOptions) {
      return ipcRenderer.invoke(STORAGE_IMAGE, imagePath, options)
    },
  }
  contextBridge.exposeInMainWorld('storage', storage)
}
