import { IMediaRepository } from '../domain/repositories/IMediaRepository'

export default class GetMediaById {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(mediaId: number) {
    return this.repo.getById(mediaId)
  }
}
