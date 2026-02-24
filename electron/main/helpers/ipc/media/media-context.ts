import { BulkUpdateMediaDTO } from '@/application/db/repositories/IMediaRepository'
import {
  MEDIA_ADD,
  MEDIA_BULK_UPDATE,
  MEDIA_FIND_DUPLICATES,
  MEDIA_GET,
  MEDIA_GET_BY_ID,
  MEDIA_REMOVE,
  MEDIA_RESOLVE_EXTERNAL_LINK,
  MEDIA_SEARCH,
  MEDIA_SET_NEXT_MEDIA,
  MEDIA_UPDATE,
} from './media-channels'
import {
  MediaPaginationOptions,
  MediaContext,
  AddMediaDTO,
  UpdateMediaDTO,
} from '@shared/types'

export function exposeMediaContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: MediaContext = {
    get(options: MediaPaginationOptions) {
      return ipcRenderer.invoke(MEDIA_GET, options)
    },
    add(media: AddMediaDTO) {
      return ipcRenderer.invoke(MEDIA_ADD, media)
    },
    remove(mediaIds: number[]) {
      return ipcRenderer.invoke(MEDIA_REMOVE, mediaIds)
    },
    update(media: UpdateMediaDTO) {
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
    getById(mediaId: number) {
      return ipcRenderer.invoke(MEDIA_GET_BY_ID, mediaId)
    },
    bulkUpdate(mediaUpdates: BulkUpdateMediaDTO) {
      return ipcRenderer.invoke(MEDIA_BULK_UPDATE, mediaUpdates)
    },
    findDuplicates(media: Partial<AddMediaDTO>) {
      return ipcRenderer.invoke(MEDIA_FIND_DUPLICATES, media)
    },
  }
  contextBridge.exposeInMainWorld('media', context)
}
