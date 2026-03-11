import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { BulkUpdateMediaDTO } from '@shared/types'

// TODO: Publish media updated event for all updated medias
export default class BulkUpdateMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(mediaUpdates: BulkUpdateMediaDTO) {
    return this.repo.bulkUpdate(mediaUpdates)
  }
}
