import { StorageService } from '@/core/StorageService'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { MediaCreateInput } from '@shared/types'

export default class AddMedia {
  constructor(
    private readonly repo: IMediaRepository,
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
