import {
  MEDIA_ADD,
  MEDIA_GET,
  MEDIA_REMOVE,
  MEDIA_RESOLVE_EXTERNAL_LINK,
  MEDIA_SEARCH,
  MEDIA_SET_NEXT_MEDIA,
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
    setNextMedia(mediaId: number, nextMediaId: number) {
      return ipcRenderer.invoke(MEDIA_SET_NEXT_MEDIA, mediaId, nextMediaId)
    },
    resolveExternalLink(mediaId: number) {
      return ipcRenderer.invoke(MEDIA_RESOLVE_EXTERNAL_LINK, mediaId)
    },
    search(query: string) {
      return ipcRenderer.invoke(MEDIA_SEARCH, query)
    },
  }
  contextBridge.exposeInMainWorld('media', context)
}
