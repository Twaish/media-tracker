import { IndexFileManifest } from '../../application/models/IndexFileManifest'
import { IIndexRegistry } from '../../application/ports/IIndexRegistry'

export class IndexRegistry implements IIndexRegistry {
  private indexFiles: Map<string, IndexFileManifest> = new Map()

  register(manifest: IndexFileManifest): IndexFileManifest {
    if (this.indexFiles.has(manifest.id)) {
      throw new Error(`Duplicate index file identifier "${manifest.id}"`)
    }

    this.indexFiles.set(manifest.id, manifest)
    return manifest
  }

  unregister(id: string): void {
    this.indexFiles.delete(id)
  }

  get(id: string): IndexFileManifest {
    const manifest = this.indexFiles.get(id)
    if (!manifest) {
      throw new Error(`Index file "${id}" not found`)
    }
    return manifest
  }

  getAll(): IndexFileManifest[] {
    return Array.from(this.indexFiles.values())
  }
}
