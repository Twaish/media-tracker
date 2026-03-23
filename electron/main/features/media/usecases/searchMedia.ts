import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { IQueryResolver } from '../application/interfaces/IQueryResolver'

export default class SearchMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly resolver: IQueryResolver,
  ) {}

  async execute(query: string) {
    const { title, filters } = this.resolver.resolve(query)

    return this.repo.search({
      title,
      filters,
    })
  }
}
