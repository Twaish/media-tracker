import { MediaRepository } from '@/application/db/repositories/mediaRepository'

export default class RemoveMedia {
  constructor(private readonly repo: MediaRepository) {}

  execute(mediaIds: number[]) {
    if (!mediaIds.length) return { deleted: 0, ids: [] }
    return this.repo.remove(mediaIds)
  }
}
