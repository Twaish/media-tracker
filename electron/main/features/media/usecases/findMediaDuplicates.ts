import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { StorageService } from '@/core/StorageService'
import { AddMediaDTO } from '../application/dto/media.dto'

export default class FindMediaDuplicates {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(media: Partial<AddMediaDTO>) {
    let thumbnail: string | null = null

    if (media?.thumbnail) {
      const stored = await this.storage.storeImage({
        imagePath: media.thumbnail,
      })
      thumbnail = stored.relativePath
    }

    const mediaToFind = {
      ...media,
      thumbnail,
    }

    return this.repo.findDuplicateCandidates(mediaToFind)
  }
}
