import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { MediaPaginationOptions } from '../application/dto/mediaDto'

export default class GetMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(options: MediaPaginationOptions) {
    return this.repo.getWithPagination(options)
  }
}
