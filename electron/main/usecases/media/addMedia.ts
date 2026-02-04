import { StorageService } from '@/core/StorageService'
import { MediaRepository } from '@/domain/repositories/mediaRepository'
import { MediaCreateInput } from '@shared/types'

export default class AddMedia {
  constructor(
    private readonly repo: MediaRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(media: MediaCreateInput) {
    let thumbnail: string | undefined

    if (media?.thumbnail) {
      const stored = await this.storage.storeImage(media.thumbnail)
      thumbnail = stored.relativePath
    }

    const mediaToAdd = {
      ...media,
      thumbnail,
    }
    return this.repo.add(mediaToAdd)
  }
}
