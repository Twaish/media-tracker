import { ipc } from '@/ipc'
import { Pagination } from '@shared/types'

export async function getDeltas(pagination?: Pagination) {
  return ipc.client.versioning.get(pagination)
}

export async function removeDeltas(ids: number[]) {
  return ipc.client.versioning.remove(ids)
}
