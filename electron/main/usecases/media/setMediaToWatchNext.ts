import { MediaRepository } from '@/domain/repositories/mediaRepository'

export default class SetMediaToWatchNext {
  constructor(private readonly repo: MediaRepository) {}

  async execute(mediaId: number, nextMediaId: number) {
    if (mediaId === nextMediaId) {
      throw new Error('A media item cannot be set to follow itself')
    }

    await this.repo.update({
      id: mediaId,
      watchAfter: nextMediaId,
    })
  }
}
