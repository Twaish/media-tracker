import { MediaRepository } from '@/application/db/repositories/mediaRepository'
import { MediaPaginationOptions } from '@shared/types'

export default class GetMedia {
  constructor(private readonly repo: MediaRepository) {}

  async execute(options: MediaPaginationOptions) {
    return this.repo.getWithPagination(options)
  }
}
