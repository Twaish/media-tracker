import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { QueryResolver } from '@/domain/services/QueryResolver'

// TODO: Change this into a SearchMedia use case instead
export default class ResolveSearchQuery {
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
