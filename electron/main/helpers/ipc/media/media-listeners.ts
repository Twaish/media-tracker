import { ipcMain } from 'electron'
import { Modules } from '../types'
import {
  MEDIA_ADD,
  MEDIA_GET,
  MEDIA_REMOVE,
  MEDIA_RESOLVE_EXTERNAL_LINK,
  MEDIA_SET_NEXT_MEDIA,
  MEDIA_UPDATE,
} from './media-channels'
import {
  MediaCreateInput,
  MediaPaginationOptions,
  MediaUpdateInput,
} from '@shared/types'
import { createMediaUseCases } from '@/usecases/media'

export function addMediaEventListeners(modules: Modules) {
  const useCases = createMediaUseCases(modules)

  ipcMain.handle(MEDIA_GET, (_, options: MediaPaginationOptions) => {
    return useCases.getMedia.execute(options)
  })
  ipcMain.handle(MEDIA_ADD, (_, input: MediaCreateInput) => {
    return useCases.addMedia.execute(input)
  })
  ipcMain.handle(MEDIA_REMOVE, (_, mediaIds: number[]) => {
    return useCases.removeMedia.execute(mediaIds)
  })
  ipcMain.handle(MEDIA_UPDATE, (_, update: MediaUpdateInput) => {
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
}
