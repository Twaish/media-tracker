import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'

export default class SetMediaToWatchNext {
  constructor(private readonly repo: IMediaRepository) {}

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
