import { Pagination } from '@shared/types'
import { IIndexQueryService } from '../application/interfaces/IIndexQueryService'

export default class GetIndexEntriess {
  constructor(private readonly queryService: IIndexQueryService) {}

  async execute(id: string, options?: Pagination) {
    return await this.queryService.getEntries(id, options)
  }
}
