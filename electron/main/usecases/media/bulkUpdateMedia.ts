import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { BulkUpdateMediaDTO } from '@shared/types'
import { MEDIA_EVENTS, MediaUpdatedPayload } from './media.events'
import { IEventBus } from '@/application/events/IEventBus'

export default class BulkUpdateMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(mediaUpdates: BulkUpdateMediaDTO) {
    const previous = await this.repo.getByIds(mediaUpdates.ids)

    const updateResult = await this.repo.bulkUpdate(mediaUpdates)

    const current = await this.repo.getByIds(updateResult.ids)

    for (let i = 0; i < current.length; i++) {
      this.eventBus.publish<MediaUpdatedPayload>(MEDIA_EVENTS.MEDIA_UPDATED, {
        previous: previous[i],
        current: current[i],
      })
    }

    return updateResult
  }
}
