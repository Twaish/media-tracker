import { Modules } from '@/helpers/ipc/types'
import RemoveMedia from './removeMedia'
import AddMedia from './addMedia'
import GetMedia from './getMedia'
import UpdateMedia from './updateMedia'
import SetMediaToWatchNext from './setMediaToWatchNext'
import ResolveExternalMediaLink from './resolveExternalMediaLink'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'

export function createMediaUseCases({
  MediaRepository,
  StorageService,
}: Modules) {
  const resolver = new ExternalLinkResolver()

  return {
    removeMedia: new RemoveMedia(MediaRepository),
    addMedia: new AddMedia(MediaRepository, StorageService),
    getMedia: new GetMedia(MediaRepository),
    updateMedia: new UpdateMedia(MediaRepository, StorageService),
    setMediaToWatchNext: new SetMediaToWatchNext(MediaRepository),
    resolveExternalMediaLink: new ResolveExternalMediaLink(
      MediaRepository,
      resolver,
    ),
  }
}
