import { StorageService } from '@/core/StorageService'
import { MediaRepository } from '@/domain/repositories/mediaRepository'
import { MediaUpdateInput } from '@shared/types'

export default class UpdateMedia {
  constructor(
    private readonly repo: MediaRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(media: MediaUpdateInput) {
    if (media.thumbnail) {
      const stored = await this.storage.storeImage(media.thumbnail)
      const thumbnail = stored.relativePath
      media = {
        ...media,
        thumbnail,
      }
    }

    return this.repo.update(media)
  }
}
