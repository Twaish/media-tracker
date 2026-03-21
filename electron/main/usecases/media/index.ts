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
import SearchMediaEmbeddings from './searchMediaEmbeddings'
import GetMediaMissingEmbeddings from './getMediaMissingEmbeddings'
import FetchMediaFromUrl from './fetchMediaFromUrl'

export function createMediaUseCases({
  MediaRepository,
  MediaEmbeddingRepository,
  MediaSimilarityService,
  AiService,
  StorageService,
  EventBus,
}: Modules) {
  const externalLinkResolver = new ExternalLinkResolver()
  const queryResolver = new QueryResolver()

  return {
    removeMedia: new RemoveMedia(MediaRepository, EventBus),
    addMedia: new AddMedia(MediaRepository, StorageService, EventBus),
    getMedia: new GetMedia(MediaRepository),
    updateMedia: new UpdateMedia(MediaRepository, StorageService, EventBus),
    setMediaToWatchNext: new SetMediaToWatchNext(MediaRepository),
    resolveExternalMediaLink: new ResolveExternalMediaLink(
      MediaRepository,
      externalLinkResolver,
    ),
    searchMedia: new SearchMedia(MediaRepository, queryResolver),
    getMediaById: new GetMediaById(MediaRepository),
    bulkUpdateMedia: new BulkUpdateMedia(MediaRepository, EventBus),
    findMediaDuplicates: new FindMediaDuplicates(
      MediaRepository,
      StorageService,
    ),
    createMediaEmbedding: new CreateMediaEmbedding(
      MediaRepository,
      MediaEmbeddingRepository,
      AiService,
      MediaSimilarityService,
    ),
    searchMediaEmbeddings: new SearchMediaEmbeddings(
      MediaSimilarityService,
      queryResolver,
    ),
    getMediaMissingEmbeddings: new GetMediaMissingEmbeddings(
      MediaEmbeddingRepository,
    ),
    fetchMediaFromUrl: new FetchMediaFromUrl(AiService),
  }
}
