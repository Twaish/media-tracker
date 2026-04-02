import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { AddMediaDTO } from '../application/dto/media.dto'
import { IStorageService } from '@/features/storage/application/interfaces/IStorageService'

export default class FindMediaDuplicates {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: IStorageService,
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
