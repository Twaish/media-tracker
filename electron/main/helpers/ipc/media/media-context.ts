import {
  MEDIA_ADD,
  MEDIA_BULK_UPDATE,
  MEDIA_CREATE_EMBEDDING,
  MEDIA_FIND_DUPLICATES,
  MEDIA_GET,
  MEDIA_GET_BY_ID,
  MEDIA_GET_MISSING_EMBEDDINGS,
  MEDIA_REMOVE,
  MEDIA_RESOLVE_EXTERNAL_LINK,
  MEDIA_SEARCH,
  MEDIA_SEARCH_EMBEDDINGS,
  MEDIA_SET_NEXT_MEDIA,
  MEDIA_UPDATE,
  MEDIA_FETCH_FROM_URL,
} from './media-channels'
import { MediaContext } from '@shared/types'

export function exposeMediaContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('media', {
    get: (options) => ipcRenderer.invoke(MEDIA_GET, options),
    add: (media) => ipcRenderer.invoke(MEDIA_ADD, media),
    remove: (mediaIds) => ipcRenderer.invoke(MEDIA_REMOVE, mediaIds),
    update: (media) => ipcRenderer.invoke(MEDIA_UPDATE, media),
    setNextMedia: (mediaId, nextMediaId) =>
      ipcRenderer.invoke(MEDIA_SET_NEXT_MEDIA, mediaId, nextMediaId),
    resolveExternalLink: (mediaId) =>
      ipcRenderer.invoke(MEDIA_RESOLVE_EXTERNAL_LINK, mediaId),
    search: (query) => ipcRenderer.invoke(MEDIA_SEARCH, query),
    getById: (mediaId) => ipcRenderer.invoke(MEDIA_GET_BY_ID, mediaId),
    bulkUpdate: (mediaUpdates) =>
      ipcRenderer.invoke(MEDIA_BULK_UPDATE, mediaUpdates),
    findDuplicates: (media) => ipcRenderer.invoke(MEDIA_FIND_DUPLICATES, media),
    createEmbedding: (mediaId, model) =>
      ipcRenderer.invoke(MEDIA_CREATE_EMBEDDING, mediaId, model),
    searchEmbeddings: (query, model) =>
      ipcRenderer.invoke(MEDIA_SEARCH_EMBEDDINGS, query, model),
    getMediaMissingEmbeddings: (model) =>
      ipcRenderer.invoke(MEDIA_GET_MISSING_EMBEDDINGS, model),
    fetchFromUrl: (url, model) =>
      ipcRenderer.invoke(MEDIA_FETCH_FROM_URL, url, model),
  } satisfies MediaContext)
}
