import { QueryResolver } from '@/domain/services/QueryResolver'
import ResolveSearchQuery from './resolveSearchQuery'

export function createSearchUseCases() {
  const resolver = new QueryResolver()

  return {
    resolveSearchQuery: new ResolveSearchQuery(resolver),
  }
}
