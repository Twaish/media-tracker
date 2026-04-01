import { createStorageRouters } from '../../features/storage/ipc'
import { Modules } from './types'

export function createOrpcRouter(modules: Modules) {
  return {
    storage: createStorageRouters(modules),
  }
}
