import { PersistedMedia } from '@/domain/entities/media'
import { Modules } from '@/helpers/ipc/types'

export enum MEDIA_EVENTS {
  MEDIA_UPDATED = 'mediaUpdated',
}

export const mediaEventDefinitions = [
  {
    name: MEDIA_EVENTS.MEDIA_UPDATED,
    description: 'Triggered when a media entry is updated',
  },
]

export type MediaUpdatedPayload = {
  current: PersistedMedia
  previous: PersistedMedia
}

export function subscribeToMediaEvents({ EventBus, RuleEngine }: Modules) {
  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_UPDATED,
    async (payload: MediaUpdatedPayload) => {
      await RuleEngine.handle(MEDIA_EVENTS.MEDIA_UPDATED, payload)
    },
  )
}

export function registerMediaEvents({ EventRegistry }: Modules) {
  mediaEventDefinitions.map(EventRegistry.register)
}
