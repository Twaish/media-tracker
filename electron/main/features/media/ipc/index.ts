import { Modules } from '@/helpers/ipc/types'
import { createMediaUseCases } from '../usecases'
import { os } from '@orpc/server'
import {
  addMediaInputSchema,
  bulkUpdateInputSchema,
  bulkUpdateOutputSchema,
  createEmbeddingInputSchema,
  createEmbeddingOutputSchema,
  fetchFromUrlInputSchema,
  fetchFromUrlOutputSchema,
  findDuplicatesInputSchema,
  findDuplicatesOutputSchema,
  findEmbeddingDuplicatesInputSchema,
  findEmbeddingDuplicatesOutputSchema,
  getByIdInputSchema,
  getMediaMissingEmbeddingsInputSchema,
  getMediaMissingEmbeddingsOutputSchema,
  getProgressHistoryInputSchema,
  getProgressHistoryOutputSchema,
  mediaSchema,
  removeMediaInputSchema,
  removeMediaOutputSchema,
  resolveExternalLinkInputSchema,
  resolveExternalLinkOutputSchema,
  searchEmbeddingsInputSchema,
  searchEmbeddingsOutputSchema,
  searchInputSchema,
  setNextMediaInputSchema,
  updateMediaInputSchema,
} from './schemas'
import { paginationResultSchema, paginationSchema } from '@/helpers/ipc/schemas'

export function createMediaRouters(modules: Modules) {
  const useCases = createMediaUseCases(modules)

  return {
    get: os
      .input(paginationSchema)
      .output(paginationResultSchema(mediaSchema))
      .handler(({ input }) => useCases.getMedia.execute(input)),
    add: os
      .input(addMediaInputSchema)
      .output(mediaSchema)
      .handler(({ input }) => useCases.addMedia.execute(input)),
    remove: os
      .input(removeMediaInputSchema)
      .output(removeMediaOutputSchema)
      .handler(({ input }) => useCases.removeMedia.execute(input)),
    update: os
      .input(updateMediaInputSchema)
      .output(mediaSchema)
      .handler(({ input }) => useCases.updateMedia.execute(input)),
    setNextMedia: os
      .input(setNextMediaInputSchema)
      .handler(({ input }) =>
        useCases.setMediaToWatchNext.execute(input.mediaId, input.nextMediaId),
      ),
    resolveExternalLink: os
      .input(resolveExternalLinkInputSchema)
      .output(resolveExternalLinkOutputSchema)
      .handler(({ input }) => useCases.resolveExternalMediaLink.execute(input)),
    search: os
      .input(searchInputSchema)
      .output(paginationResultSchema(mediaSchema))
      .handler(({ input }) => useCases.searchMedia.execute(input)),
    getById: os
      .input(getByIdInputSchema)
      .output(mediaSchema)
      .handler(({ input }) => useCases.getMediaById.execute(input)),
    bulkUpdate: os
      .input(bulkUpdateInputSchema)
      .output(bulkUpdateOutputSchema)
      .handler(({ input }) => useCases.bulkUpdateMedia.execute(input)),
    findDuplicates: os
      .input(findDuplicatesInputSchema)
      .output(findDuplicatesOutputSchema)
      .handler(({ input }) => useCases.findMediaDuplicates.execute(input)),
    createEmbedding: os
      .input(createEmbeddingInputSchema)
      .output(createEmbeddingOutputSchema)
      .handler(({ input }) =>
        useCases.createMediaEmbedding.execute(input.mediaId, input.model),
      ),
    searchEmbeddings: os
      .input(searchEmbeddingsInputSchema)
      .output(searchEmbeddingsOutputSchema)
      .handler(({ input }) =>
        useCases.searchMediaEmbeddings.execute(input.query, input.model),
      ),
    getMediaMissingEmbeddings: os
      .input(getMediaMissingEmbeddingsInputSchema)
      .output(getMediaMissingEmbeddingsOutputSchema)
      .handler(({ input }) =>
        useCases.getMediaMissingEmbeddings.execute(input.model),
      ),
    fetchFromUrl: os
      .input(fetchFromUrlInputSchema)
      .output(fetchFromUrlOutputSchema)
      .handler(({ input }) =>
        useCases.fetchMediaFromUrl.execute(input.url, input.model),
      ),
    getProgressHistory: os
      .input(getProgressHistoryInputSchema)
      .output(getProgressHistoryOutputSchema)
      .handler(({ input }) => useCases.getMediaProgressHistory.execute(input)),
    findEmbeddingDuplicates: os
      .input(findEmbeddingDuplicatesInputSchema)
      .output(findEmbeddingDuplicatesOutputSchema)
      .handler(({ input }) =>
        useCases.findMediaEmbeddingDuplicates.execute(
          input.model,
          input.k,
          input.threshold,
        ),
      ),
  }
}
