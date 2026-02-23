import {
  BulkUpdateMediaDTO,
  IMediaRepository,
} from '@/application/db/repositories/IMediaRepository'

export default class BulkUpdateMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(mediaUpdates: BulkUpdateMediaDTO) {
    return this.repo.bulkUpdate(mediaUpdates)
  }
}
