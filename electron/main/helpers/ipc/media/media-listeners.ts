import { Modules } from '../types'
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
import { createMediaUseCases } from '@/usecases/media'
import { registerIpcHandlers } from '../register-ipc-handlers'

export function addMediaEventListeners(modules: Modules) {
  const useCases = createMediaUseCases(modules)

  registerIpcHandlers<MediaContext>({
    get: [MEDIA_GET, (_, options) => useCases.getMedia.execute(options)],
    add: [MEDIA_ADD, (_, media) => useCases.addMedia.execute(media)],
    remove: [MEDIA_REMOVE, (_, ids) => useCases.removeMedia.execute(ids)],
    update: [MEDIA_UPDATE, (_, media) => useCases.updateMedia.execute(media)],
    setNextMedia: [
      MEDIA_SET_NEXT_MEDIA,
      (_, mediaId, nextMediaId) =>
        useCases.setMediaToWatchNext.execute(mediaId, nextMediaId),
    ],
    resolveExternalLink: [
      MEDIA_RESOLVE_EXTERNAL_LINK,
      (_, id) => useCases.resolveExternalMediaLink.execute(id),
    ],
    search: [MEDIA_SEARCH, (_, query) => useCases.searchMedia.execute(query)],
    getById: [MEDIA_GET_BY_ID, (_, id) => useCases.getMediaById.execute(id)],
    bulkUpdate: [
      MEDIA_BULK_UPDATE,
      (_, updates) => useCases.bulkUpdateMedia.execute(updates),
    ],
    findDuplicates: [
      MEDIA_FIND_DUPLICATES,
      (_, media) => useCases.findMediaDuplicates.execute(media),
    ],
    createEmbedding: [
      MEDIA_CREATE_EMBEDDING,
      (_, id, model) => useCases.createMediaEmbedding.execute(id, model),
    ],
    searchEmbeddings: [
      MEDIA_SEARCH_EMBEDDINGS,
      (_, query, model) => useCases.searchMediaEmbeddings.execute(query, model),
    ],
    getMediaMissingEmbeddings: [
      MEDIA_GET_MISSING_EMBEDDINGS,
      (_, model) => useCases.getMediaMissingEmbeddings.execute(model),
    ],
    fetchFromUrl: [
      MEDIA_FETCH_FROM_URL,
      (_, url, model) => useCases.fetchMediaFromUrl.execute(url, model),
    ],
  })
}
