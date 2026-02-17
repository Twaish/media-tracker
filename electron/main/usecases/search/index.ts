import { QueryResolver } from '@/domain/services/QueryResolver'
import ResolveSearchQuery from './resolveSearchQuery'
import { Modules } from '@/helpers/ipc/types'

export function createSearchUseCases({ MediaRepository }: Modules) {
  const resolver = new QueryResolver()

  return {
    resolveSearchQuery: new ResolveSearchQuery(MediaRepository, resolver),
  }
}
