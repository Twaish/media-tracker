import { PersistedMedia } from '@/domain/entities/media'

export enum MEDIA_EVENTS {
  MEDIA_UPDATED = 'media.updated',
}

export type MediaUpdatedPayload = {
  current: PersistedMedia
  previous: PersistedMedia
}
