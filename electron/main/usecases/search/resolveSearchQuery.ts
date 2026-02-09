import { QueryResolver } from '@/domain/services/QueryResolver'

export default class ResolveSearchQuery {
  constructor(private readonly resolver: QueryResolver) {}

  async execute(query: string) {
    return this.resolver.resolve(query)
  }
}
