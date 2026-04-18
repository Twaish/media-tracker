import { ipc } from '@/ipc'
import {
  AddMediaDTO,
  BulkUpdateMediaDTO,
  Pagination,
  UpdateMediaDTO,
} from '@shared/types'

export function getMedia(pagination?: Pagination) {
  return ipc.client.media.get(pagination)
}

export function addMedia(media: AddMediaDTO) {
  return ipc.client.media.add(media)
}

export function removeMedia(ids: number[]) {
  return ipc.client.media.remove(ids)
}

export function updateMedia(media: UpdateMediaDTO) {
  return ipc.client.media.update(media)
}

export function setNextMedia(mediaId: number, nextMediaId: number) {
  return ipc.client.media.setNextMedia({ mediaId, nextMediaId })
}

export function resolveExternalMediaLink(id: number) {
  return ipc.client.media.resolveExternalLink(id)
}

export function searchMedia(query: string) {
  return ipc.client.media.search(query)
}

export function getMediaById(id: number) {
  return ipc.client.media.getById(id)
}

export function bulkUpdateMedia(updates: BulkUpdateMediaDTO) {
  return ipc.client.media.bulkUpdate(updates)
}

export function findMediaDuplicates(media: Partial<AddMediaDTO>) {
  return ipc.client.media.findDuplicates(media)
}

export function createMediaEmbedding(id: number, model: string) {
  return ipc.client.media.createEmbedding({ mediaId: id, model })
}

export function searchMediaEmbeddings(query: string, model: string) {
  return ipc.client.media.searchEmbeddings({ query, model })
}

export function fetchMediaFromUrl(url: string, model: string) {
  return ipc.client.media.fetchFromUrl({ url, model })
}

export function getMediaProgressHistory(id: number) {
  return ipc.client.media.getProgressHistory(id)
}

export function findMediaEmbeddingDuplicates(
  model: string,
  k?: number,
  threshold?: number,
) {
  return ipc.client.media.findEmbeddingDuplicates({ model, k, threshold })
}
