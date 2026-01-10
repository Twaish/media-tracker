import { MEDIA_ADD, MEDIA_GET, MEDIA_REMOVE } from './media-channels'
import {
  MediaPaginationOptions,
  MediaCreateInput,
  MediaContext,
} from '@shared/types'

export function exposeMediaContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: MediaContext = {
    get: (options: MediaPaginationOptions) =>
      ipcRenderer.invoke(MEDIA_GET, options),
    add: (media: MediaCreateInput) => ipcRenderer.invoke(MEDIA_ADD, media),
    remove: (mediaIds: number[]) => ipcRenderer.invoke(MEDIA_REMOVE, mediaIds),
  }
  contextBridge.exposeInMainWorld('media', context)
}
