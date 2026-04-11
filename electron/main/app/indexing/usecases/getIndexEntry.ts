import { IIndexQueryService } from '../application/interfaces/IIndexQueryService'

export default class GetIndexEntry {
  constructor(private readonly queryService: IIndexQueryService) {}

  async execute(id: string, index: number) {
    return await this.queryService.getEntry(id, index)
  }
}
