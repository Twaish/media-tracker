import { ipcMain } from 'electron'
import { Modules } from '../types'
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
  AddMediaDTO,
  MediaPaginationOptions,
  UpdateMediaDTO,
} from '@shared/types'
import { createMediaUseCases } from '@/usecases/media'
import { BulkUpdateMediaDTO } from '@/application/db/repositories/IMediaRepository'

export function addMediaEventListeners(modules: Modules) {
  const useCases = createMediaUseCases(modules)

  ipcMain.handle(MEDIA_GET, (_, options: MediaPaginationOptions) => {
    return useCases.getMedia.execute(options)
  })
  ipcMain.handle(MEDIA_ADD, (_, input: AddMediaDTO) => {
    return useCases.addMedia.execute(input)
  })
  ipcMain.handle(MEDIA_REMOVE, (_, mediaIds: number[]) => {
    return useCases.removeMedia.execute(mediaIds)
  })
  ipcMain.handle(MEDIA_UPDATE, (_, update: UpdateMediaDTO) => {
    return useCases.updateMedia.execute(update)
  })
  ipcMain.handle(
    MEDIA_SET_NEXT_MEDIA,
    (_, mediaId: number, nextMediaId: number) => {
      return useCases.setMediaToWatchNext.execute(mediaId, nextMediaId)
    },
  )
  ipcMain.handle(MEDIA_RESOLVE_EXTERNAL_LINK, (_, mediaId: number) => {
    return useCases.resolveExternalMediaLink.execute(mediaId)
  })
  ipcMain.handle(MEDIA_SEARCH, (_, query: string) => {
    return useCases.searchMedia.execute(query)
  })
  ipcMain.handle(MEDIA_GET_BY_ID, (_, mediaId: number) => {
    return useCases.getMediaById.execute(mediaId)
  })
  ipcMain.handle(MEDIA_BULK_UPDATE, (_, mediaUpdates: BulkUpdateMediaDTO) => {
    return useCases.bulkUpdateMedia.execute(mediaUpdates)
  })
  ipcMain.handle(MEDIA_FIND_DUPLICATES, (_, media: Partial<AddMediaDTO>) => {
    return useCases.findMediaDuplicates.execute(media)
  })
}
