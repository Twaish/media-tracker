import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { QueryResolver } from '@/domain/services/QueryResolver'

export default class SearchMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly resolver: QueryResolver,
  ) {}

  async execute(query: string) {
    const { title, filters } = this.resolver.resolve(query)

    return this.repo.search({
      title,
      filters,
    })
  }
}
