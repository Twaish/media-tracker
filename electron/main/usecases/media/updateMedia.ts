import { StorageService } from '@/core/StorageService'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { UpdateMediaDTO } from '@shared/types'
import { EventBus } from '@/core/EventBus'
import { MEDIA_EVENTS, MediaUpdatedPayload } from './media.events'

export default class UpdateMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: StorageService,
    private readonly eventBus: EventBus,
  ) {}

  async execute(media: UpdateMediaDTO) {
    if (media.thumbnail) {
      const stored = await this.storage.storeImage(media.thumbnail)
      const thumbnail = stored.relativePath
      media = {
        ...media,
        thumbnail,
      }
    }
    const mediaToUpdate = await this.repo.getById(media.id)
    const updatedMedia = await this.repo.update(media)

    this.eventBus.publish<MediaUpdatedPayload>(MEDIA_EVENTS.MEDIA_UPDATED, {
      previous: mediaToUpdate,
      current: updatedMedia,
    })

    return updatedMedia
  }
}
