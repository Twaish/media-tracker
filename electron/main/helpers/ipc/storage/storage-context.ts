import { StorageContext } from '@shared/types'
import { STORAGE_EXPORT_IMAGES, STORAGE_IMAGE } from './storage-channels'

export function exposeStorageContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('storage', {
    storeImage: (imagePath, options) =>
      ipcRenderer.invoke(STORAGE_IMAGE, imagePath, options),
    exportImages: (destinationPath) =>
      ipcRenderer.invoke(STORAGE_EXPORT_IMAGES, destinationPath),
  } satisfies StorageContext)
}
