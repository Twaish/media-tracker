import { IndexFileManifest } from '../models/IndexFileManifest'

export type IndexSearchResult = {
  title: string
  index: number
}

export interface IIndexRegistry {
  register(manifest: IndexFileManifest): IndexFileManifest
  unregister(id: string): void

  get(id: string): IndexFileManifest
  getAll(): IndexFileManifest[]
}
