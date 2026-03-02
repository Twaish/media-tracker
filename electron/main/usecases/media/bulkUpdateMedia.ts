import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { BulkUpdateMediaDTO } from '@shared/types'

export default class BulkUpdateMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(mediaUpdates: BulkUpdateMediaDTO) {
    return this.repo.bulkUpdate(mediaUpdates)
  }
}
