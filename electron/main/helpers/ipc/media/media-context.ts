import {
  MEDIA_ADD,
  MEDIA_GET,
  MEDIA_REMOVE,
  MEDIA_UPDATE,
} from './media-channels'
import {
  MediaPaginationOptions,
  MediaCreateInput,
  MediaContext,
  MediaUpdateInput,
} from '@shared/types'

export function exposeMediaContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: MediaContext = {
    get(options: MediaPaginationOptions) {
      return ipcRenderer.invoke(MEDIA_GET, options)
    },
    add(media: MediaCreateInput) {
      return ipcRenderer.invoke(MEDIA_ADD, media)
    },
    remove(mediaIds: number[]) {
      return ipcRenderer.invoke(MEDIA_REMOVE, mediaIds)
    },
    update(media: MediaUpdateInput) {
      return ipcRenderer.invoke(MEDIA_UPDATE, media)
    },
  }
  contextBridge.exposeInMainWorld('media', context)
}
