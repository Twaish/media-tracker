import { createVersioningUseCases } from '@/app/versioning/usecases'
import { Modules } from './ipc/types'
import {
  MEDIA_EVENTS,
  MediaAddedPayload,
  MediaRemovedPayload,
  MediaUpdatedPayload,
} from '@/features/media/events/media.events'
import { deepDiff } from './deep-diff'

export function registerVersioningEvents(modules: Modules) {
  const { EventBus } = modules
  const versioningUseCases = createVersioningUseCases(modules)

  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_UPDATED,
    async (event: MediaUpdatedPayload) => {
      setTimeout(async () => {
        await versioningUseCases.addDelta.execute({
          type: 'update',
          entity: 'media',
          entityId: event.current.id,
          before: JSON.stringify(deepDiff(event.current, event.previous)),
          after: JSON.stringify(deepDiff(event.previous, event.current)),
        })
      }, 0)
    },
  )

  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_REMOVED,
    async (event: MediaRemovedPayload) => {
      await versioningUseCases.addDelta.execute({
        type: 'remove',
        entity: 'media',
        entityId: event.current.id,
        before: JSON.stringify(event.current),
      })
    },
  )

  EventBus.subscribe(
    MEDIA_EVENTS.MEDIA_ADDED,
    async (event: MediaAddedPayload) => {
      await versioningUseCases.addDelta.execute({
        type: 'add',
        entity: 'media',
        entityId: event.current.id,
        after: JSON.stringify(event.current),
      })
    },
  )
}
