import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { MediaPaginationOptions } from '@shared/types'

export default class GetMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(options: MediaPaginationOptions) {
    return this.repo.getWithPagination(options)
  }
}
