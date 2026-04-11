import { Modules } from '@/helpers/ipc/types'
import { createIndexingUseCases } from '../usecases'
import { os } from '@orpc/server'
import {
  getAllManifestsOutputSchema,
  getEntryInputSchema,
  getManifestInputSchema,
  getManifestOutputSchema,
  importInputSchema,
  importOutputSchema,
  isOutdatedInputSchema,
  isOutdatedOutputSchema,
  refreshIndexInputSchema,
  refreshIndexOutputSchema,
  searchIndexInputSchema,
  searchIndexOutputSchema,
  toggleIndexInputSchema,
  toggleIndexOutputSchema,
  updateExtractionInputSchema,
  updateExtractionOutputSchema,
} from './schemas'

export function createIndexingRouters(modules: Modules) {
  const useCases = createIndexingUseCases(modules)

  return {
    disableIndex: os
      .input(toggleIndexInputSchema)
      .output(toggleIndexOutputSchema)
      .handler(({ input }) => useCases.disableIndexFile.execute(input)),
    enableIndex: os
      .input(toggleIndexInputSchema)
      .output(toggleIndexOutputSchema)
      .handler(({ input }) => useCases.enableIndexFile.execute(input)),
    getAllManifests: os
      .output(getAllManifestsOutputSchema)
      .handler(() => useCases.getAllIndexManifests.execute()),
    getEntry: os
      .input(getEntryInputSchema)
      .handler(({ input }) =>
        useCases.getIndexEntry.execute(input.id, input.index),
      ),
    getManifest: os
      .input(getManifestInputSchema)
      .output(getManifestOutputSchema)
      .handler(({ input }) => useCases.getIndexManifest.execute(input)),
    import: os
      .input(importInputSchema)
      .output(importOutputSchema)
      .handler(({ input }) => useCases.importIndexFile.execute(input)),
    isOutdated: os
      .input(isOutdatedInputSchema)
      .output(isOutdatedOutputSchema)
      .handler(({ input }) => useCases.checkIndexOutdated.execute(input)),
    refreshIndex: os
      .input(refreshIndexInputSchema)
      .output(refreshIndexOutputSchema)
      .handler(({ input }) => useCases.refreshIndexFile.execute(input)),
    searchIndex: os
      .input(searchIndexInputSchema)
      .output(searchIndexOutputSchema)
      .handler(({ input }) =>
        useCases.searchIndex.execute(input.query, input.ids),
      ),
    updateExtractionSchema: os
      .input(updateExtractionInputSchema)
      .output(updateExtractionOutputSchema)
      .handler(({ input }) => useCases.updateExtractionSchema.execute(input)),
  }
}
