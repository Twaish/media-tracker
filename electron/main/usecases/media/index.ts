import { Modules } from '@/helpers/ipc/types'
import RemoveMedia from './removeMedia'
import AddMedia from './addMedia'
import GetMedia from './getMedia'
import UpdateMedia from './updateMedia'
import SetMediaToWatchNext from './setMediaToWatchNext'
import ResolveExternalMediaLink from './resolveExternalMediaLink'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'
import SearchMedia from './searchMedia'
import { QueryResolver } from '@/domain/services/QueryResolver'
import GetMediaById from './getMediaById'
import BulkUpdateMedia from './bulkUpdateMedia'
import FindMediaDuplicates from './findMediaDuplicates'
import CreateMediaEmbedding from './createMediaEmbedding'

export function createMediaUseCases({
  MediaRepository,
  MediaEmbeddingRepository,
  AiService,
  StorageService,
}: Modules) {
  const externalLinkResolver = new ExternalLinkResolver()
  const queryResolver = new QueryResolver()

  return {
    removeMedia: new RemoveMedia(MediaRepository),
    addMedia: new AddMedia(MediaRepository, StorageService),
    getMedia: new GetMedia(MediaRepository),
    updateMedia: new UpdateMedia(MediaRepository, StorageService),
    setMediaToWatchNext: new SetMediaToWatchNext(MediaRepository),
    resolveExternalMediaLink: new ResolveExternalMediaLink(
      MediaRepository,
      externalLinkResolver,
    ),
    searchMedia: new SearchMedia(MediaRepository, queryResolver),
    getMediaById: new GetMediaById(MediaRepository),
    bulkUpdateMedia: new BulkUpdateMedia(MediaRepository),
    findMediaDuplicates: new FindMediaDuplicates(
      MediaRepository,
      StorageService,
    ),
    createMediaEmbedding: new CreateMediaEmbedding(
      MediaRepository,
      MediaEmbeddingRepository,
      AiService,
    ),
  }
}
