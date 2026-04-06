import { IMediaProgressRepository } from '../domain/repositories/IMediaProgressRepository'

export default class GetMediaProgressHistory {
  constructor(private readonly repo: IMediaProgressRepository) {}

  async execute(mediaId: number) {
    return this.repo.getByMediaId(mediaId)
  }
}
