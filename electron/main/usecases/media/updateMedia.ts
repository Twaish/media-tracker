import { StorageService } from '@/core/StorageService'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { MediaUpdateInput } from '@shared/types'

export default class UpdateMedia {
  constructor(
    private readonly repo: IMediaRepository,
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
