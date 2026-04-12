import { Modules } from '@/helpers/ipc/types'
import DisableIndexFile from './disableIndexFile'
import EnableIndexFile from './enableIndexFile'
import GetAllIndexManifests from './getAllIndexManifests'
import GetIndexEntry from './getIndexEntry'
import GetIndexManifest from './getIndexManifest'
import ImportIndexFile from './importIndexfile'
import CheckIndexOutdated from './checkIndexOutdated'
import RefreshIndexFile from './refreshIndexFile'
import RemoveIndex from './removeIndex'
import SearchIndex from './searchIndex'
import UpdateExtractionSchema from './updateExtractionSchema'
import GetIndexEntriess from './getIndexEntries'

export function createIndexingUseCases({
  IndexManager,
  IndexRegistry,
  IndexQueryService,
}: Modules) {
  return {
    disableIndexFile: new DisableIndexFile(IndexManager),
    enableIndexFile: new EnableIndexFile(IndexManager),
    getAllIndexManifests: new GetAllIndexManifests(IndexRegistry),
    getIndexEntry: new GetIndexEntry(IndexQueryService),
    getIndexEntries: new GetIndexEntriess(IndexQueryService),
    getIndexManifest: new GetIndexManifest(IndexRegistry),
    importIndexFile: new ImportIndexFile(IndexManager),
    checkIndexOutdated: new CheckIndexOutdated(IndexManager),
    refreshIndexFile: new RefreshIndexFile(IndexManager),
    removeIndex: new RemoveIndex(IndexManager),
    searchIndex: new SearchIndex(IndexQueryService),
    updateExtractionSchema: new UpdateExtractionSchema(IndexManager),
  }
}
