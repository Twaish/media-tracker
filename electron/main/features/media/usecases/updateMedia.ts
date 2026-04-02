import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { UpdateMediaDTO } from '../application/dto/media.dto'
import { MEDIA_EVENTS, MediaUpdatedPayload } from './media.events'
import { IEventBus } from '@/features/events/application/ports/IEventBus'
import { IStorageService } from '@/features/storage/application/interfaces/IStorageService'

export default class UpdateMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: IStorageService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(media: UpdateMediaDTO) {
    if (media.thumbnail) {
      const stored = await this.storage.storeImage({
        imagePath: media.thumbnail,
      })
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
