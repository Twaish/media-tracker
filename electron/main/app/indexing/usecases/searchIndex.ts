import { IIndexQueryService } from '../application/interfaces/IIndexQueryService'

export default class SearchIndex {
  constructor(private readonly queryService: IIndexQueryService) {}

  async execute(query: string, ids?: string[]) {
    return await this.queryService.search(query, ids)
  }
}
