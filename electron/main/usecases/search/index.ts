import { QueryResolver } from '@/domain/services/QueryResolver'
import ResolveSearchQuery from './resolveSearchQuery'
import { Modules } from '@/helpers/ipc/types'
import { MediaRepositoryDrizzle } from '@/infrastructure/db/repositories/mediaRepositoryDrizzle'

export function createSearchUseCases({ Database }: Modules) {
  const repo = new MediaRepositoryDrizzle(Database)
  const resolver = new QueryResolver()

  return {
    resolveSearchQuery: new ResolveSearchQuery(repo, resolver),
  }
}
