import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { UpdateMediaDTO } from '../application/dto/media.dto'
import { MEDIA_EVENTS, MediaUpdatedPayload } from '../events/media.events'
import { IEventBus } from '@/app/events/application/ports/IEventBus'
import { IStorageService } from '@/app/storage/application/interfaces/IStorageService'

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
      media.thumbnail = stored.relativePath
    }

    const mediaToUpdate = await this.repo.getById(media.id)
    if (media.currentEpisode != null) {
      media.currentEpisode = Math.max(media.currentEpisode, 0)

      if (mediaToUpdate.maxEpisodes != null) {
        media.currentEpisode = Math.min(
          media.currentEpisode,
          mediaToUpdate.maxEpisodes,
        )
      }
    }
    const updatedMedia = await this.repo.update(media)

    this.eventBus.publish<MediaUpdatedPayload>(MEDIA_EVENTS.MEDIA_UPDATED, {
      previous: mediaToUpdate,
      current: updatedMedia,
    })

    return updatedMedia
  }
}
