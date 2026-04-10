import { IndexFileManifest } from '../models/IndexFileManifest'

export interface IIndexRegistry {
  register(manifest: IndexFileManifest): IndexFileManifest
  unregister(id: string): void

  get(id: string): IndexFileManifest
  getAll(): IndexFileManifest[]
}
