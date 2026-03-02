import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'

export default class RemoveMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(mediaIds: number[]) {
    if (!mediaIds.length) return { deleted: 0, ids: [] }
    return this.repo.remove(mediaIds)
  }
}
