import { StorageContext } from '@shared/types'
import { STORAGE_IMAGE } from './storage-channels'

export function exposeStorageContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('storage', {
    storeImage: (imagePath, options) =>
      ipcRenderer.invoke(STORAGE_IMAGE, imagePath, options),
  } satisfies StorageContext)
}
