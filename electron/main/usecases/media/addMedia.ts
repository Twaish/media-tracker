import { StorageService } from '@/core/StorageService'
import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { AddMediaDTO } from '@shared/types'

export default class AddMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(media: AddMediaDTO) {
    let thumbnail: string | null = null

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
