import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { StorageService } from '@/core/StorageService'
import { AddMediaDTO } from '@shared/types'

export default class FindMediaDuplicates {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly storage: StorageService,
  ) {}

  async execute(media: Partial<AddMediaDTO>) {
    let thumbnail: string | null = null

    if (media?.thumbnail) {
      const stored = await this.storage.storeImage(media.thumbnail)
      thumbnail = stored.relativePath
    }

    const mediaToFind = {
      ...media,
      thumbnail,
    }

    return this.repo.findDuplicateCandidates(mediaToFind)
  }
}
