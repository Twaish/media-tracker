import { MediaRepositoryDrizzle } from '@/infrastructure/db/repositories/mediaRepositoryDrizzle'
import { Modules } from '@/helpers/ipc/types'
import RemoveMedia from './removeMedia'
import AddMedia from './addMedia'
import GetMedia from './getMedia'
import UpdateMedia from './updateMedia'
import SetMediaToWatchNext from './setMediaToWatchNext'
import ResolveExternalMediaLink from './resolveExternalMediaLink'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'

export function createMediaUseCases({ Database, StorageService }: Modules) {
  const repo = new MediaRepositoryDrizzle(Database)
  const resolver = new ExternalLinkResolver()

  return {
    removeMedia: new RemoveMedia(repo),
    addMedia: new AddMedia(repo, StorageService),
    getMedia: new GetMedia(repo),
    updateMedia: new UpdateMedia(repo, StorageService),
    setMediaToWatchNext: new SetMediaToWatchNext(repo),
    resolveExternalMediaLink: new ResolveExternalMediaLink(repo, resolver),
  }
}
