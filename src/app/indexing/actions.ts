import { ipc } from '@/ipc'
import { Pagination } from '@shared/types'
import { IndexExtractionSchema } from '@shared/types/features/indexing'

export async function disableIndex(indexName: string) {
  return ipc.client.indexing.disableIndex(indexName)
}

export async function enableIndex(indexName: string) {
  return ipc.client.indexing.enableIndex(indexName)
}

export async function getAllIndexManifests() {
  return ipc.client.indexing.getAllManifests()
}

export async function getIndexEntry(id: string, index: number) {
  return ipc.client.indexing.getEntry({ id, index })
}

export async function getIndexEntries(id: string, options?: Pagination) {
  return ipc.client.indexing.getEntries({ id, options })
}

export async function getIndexManifest(id: string) {
  return ipc.client.indexing.getManifest(id)
}

export async function importIndex(
  source: string,
  extraction: IndexExtractionSchema,
) {
  return ipc.client.indexing.import({ source, extraction })
}

export async function isIndexOutdated(id: string) {
  return ipc.client.indexing.isOutdated(id)
}

export async function refreshIndex(id: string) {
  return ipc.client.indexing.refreshIndex(id)
}

export async function searchIndex(query: string, ids?: string[]) {
  return ipc.client.indexing.searchIndex({ query, ids })
}

export async function updateIndexExtraction(
  id: string,
  extraction: IndexExtractionSchema,
) {
  return ipc.client.indexing.updateExtractionSchema({ id, extraction })
}
