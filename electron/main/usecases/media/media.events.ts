import { PersistedMedia } from '@/domain/entities/media'
import { Modules } from '@/helpers/ipc/types'

export enum MEDIA_EVENTS {
  MEDIA_UPDATED = 'mediaUpdated',
  MEDIA_ADDED = 'mediaAdded',
  MEDIA_REMOVED = 'mediaRemoved',
}

export const mediaEventDefinitions = [
  {
    name: MEDIA_EVENTS.MEDIA_UPDATED,
    description: 'Triggered when a media entry is updated',
  },
  {
    name: MEDIA_EVENTS.MEDIA_ADDED,
    description: 'Triggered when a media entry is added',
  },
  {
    name: MEDIA_EVENTS.MEDIA_REMOVED,
    description: 'Triggered when a media entry is removed',
  },
]

export type MediaUpdatedPayload = {
  current: PersistedMedia
  previous: PersistedMedia
}

export type MediaAddedPayload = {
  current: PersistedMedia
}

export type MediaRemovedPayload = {
  current: PersistedMedia
}

export function subscribeToMediaEvents({ EventBus, RuleEngine }: Modules) {
  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_UPDATED,
    async (payload: MediaUpdatedPayload) => {
      await RuleEngine.handle(MEDIA_EVENTS.MEDIA_UPDATED, payload)
    },
  )
  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_ADDED,
    async (payload: MediaAddedPayload) => {
      await RuleEngine.handle(MEDIA_EVENTS.MEDIA_ADDED, payload)
    },
  )
  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_REMOVED,
    async (payload: MediaRemovedPayload) => {
      await RuleEngine.handle(MEDIA_EVENTS.MEDIA_REMOVED, payload)
    },
  )
}

export function registerMediaEvents({ EventRegistry }: Modules) {
  mediaEventDefinitions.map((definition) => EventRegistry.register(definition))
}
