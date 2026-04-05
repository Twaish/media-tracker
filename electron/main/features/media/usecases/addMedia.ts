import { IStorageService } from '@/app/storage/application/interfaces/IStorageService'
import { AddMediaDTO } from '../application/dto/media.dto'
import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { MEDIA_EVENTS, MediaAddedPayload } from '../events/media.events'
import { IEventBus } from '@/app/events/application/ports/IEventBus'

export default class AddMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: IStorageService,
    private readonly eventBus: IEventBus,
  ) {}

  async execute(media: AddMediaDTO) {
    let thumbnail: string | null = null

    if (media?.thumbnail) {
      const stored = await this.storage.storeImage({
        imagePath: media.thumbnail,
      })
      thumbnail = stored.relativePath
    }

    const mediaToAdd = {
      ...media,
      thumbnail,
    }

    const addedMedia = await this.repo.add(mediaToAdd)

    this.eventBus.publish<MediaAddedPayload>(MEDIA_EVENTS.MEDIA_ADDED, {
      current: addedMedia,
    })

    return addedMedia
  }
}
