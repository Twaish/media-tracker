import { ipcMain } from 'electron'
import { Modules } from '../types'
import {
  MEDIA_ADD,
  MEDIA_GET,
  MEDIA_REMOVE,
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
}
