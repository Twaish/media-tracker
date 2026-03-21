import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IEventBus } from '@/application/events/IEventBus'
import { MEDIA_EVENTS, MediaRemovedPayload } from './media.events'

export default class RemoveMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(mediaIds: number[]) {
    if (!mediaIds.length) return { deleted: 0, ids: [] }

    const mediaToRemove = await this.repo.getByIds(mediaIds)

    const removeResult = await this.repo.remove(mediaIds)

    for (const id of removeResult.ids) {
      const removedMedia = mediaToRemove.find((m) => m.id === id)
      if (!removedMedia) continue

      this.eventBus.publish<MediaRemovedPayload>(MEDIA_EVENTS.MEDIA_REMOVED, {
        current: removedMedia,
      })
    }

    return removeResult
  }
}
