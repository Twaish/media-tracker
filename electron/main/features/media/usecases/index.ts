import { Modules } from '@/helpers/ipc/types'
import RemoveMedia from './removeMedia'
import AddMedia from './addMedia'
import GetMedia from './getMedia'
import UpdateMedia from './updateMedia'
import SetMediaToWatchNext from './setMediaToWatchNext'
import ResolveExternalMediaLink from './resolveExternalMediaLink'
import SearchMedia from './searchMedia'
import GetMediaById from './getMediaById'
import BulkUpdateMedia from './bulkUpdateMedia'
import FindMediaDuplicates from './findMediaDuplicates'
import CreateMediaEmbedding from './createMediaEmbedding'
import SearchMediaEmbeddings from './searchMediaEmbeddings'
import GetMediaMissingEmbeddings from './getMediaMissingEmbeddings'
import FetchMediaFromUrl from './fetchMediaFromUrl'
import GetMediaProgressHistory from './getMediaProgressHistory'
import FindMediaEmbeddingDuplicates from './findMediaEmbeddingDuplicates'

export function createMediaUseCases({
  MediaRepository,
  MediaEmbeddingRepository,
  MediaProgressRepository,
  MediaSimilarityService,
  AiService,
  StorageService,
  EventBus,
  ExternalLinkResolver,
  QueryResolver,
}: Modules) {
  return {
    removeMedia: new RemoveMedia(MediaRepository, EventBus),
    addMedia: new AddMedia(MediaRepository, StorageService, EventBus),
    getMedia: new GetMedia(MediaRepository),
    updateMedia: new UpdateMedia(MediaRepository, StorageService, EventBus),
    setMediaToWatchNext: new SetMediaToWatchNext(MediaRepository),
    resolveExternalMediaLink: new ResolveExternalMediaLink(
      MediaRepository,
      ExternalLinkResolver,
    ),
    searchMedia: new SearchMedia(MediaRepository, QueryResolver),
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
      QueryResolver,
    ),
    getMediaMissingEmbeddings: new GetMediaMissingEmbeddings(
      MediaEmbeddingRepository,
    ),
    fetchMediaFromUrl: new FetchMediaFromUrl(AiService),
    getMediaProgressHistory: new GetMediaProgressHistory(
      MediaProgressRepository,
    ),
    findMediaEmbeddingDuplicates: new FindMediaEmbeddingDuplicates(
      MediaSimilarityService,
      MediaEmbeddingRepository,
    ),
  }
}
