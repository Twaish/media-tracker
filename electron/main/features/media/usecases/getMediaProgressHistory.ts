import { IMediaProgressRepository } from '../domain/repositories/IMediaProgressRepository'

export default class GetMediaProgressHistory {
  constructor(private readonly repo: IMediaProgressRepository) {}

  async execute(mediaId: number) {
    const mediaProgress = await this.repo.getByMediaId(mediaId)
    return mediaProgress.map((m) => m.toDTO())
  }
}
