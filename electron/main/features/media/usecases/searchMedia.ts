import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { IQueryResolver } from '../application/interfaces/IQueryResolver'
import { Pagination } from '@shared/types'

export default class SearchMedia {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly resolver: IQueryResolver,
  ) {}

  async execute({ query, options }: { query: string; options?: Pagination }) {
    const { title, filters } = this.resolver.resolve(query)

    return this.repo.search({
      title,
      filters,
      pagination: options,
    })
  }
}
