import fs from 'fs/promises'
import {
  IndexExtractionSchema,
  IndexFileManifest,
} from '../../application/models/IndexFileManifest'
import {
  IIndexRegistry,
  IndexSearchResult,
} from '../../application/ports/IIndexRegistry'

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

  async search(
    query: string,
    ids?: string[],
  ): Promise<Record<string, IndexSearchResult[]>> {
    const result: Record<string, IndexSearchResult[]> = {}
    ids = ids ?? Array.from(this.indexFiles.keys())
    const q = query.toLowerCase()

    for (const id of ids) {
      const manifest = this.indexFiles.get(id)
      if (!manifest || !manifest.enabled) continue

      const entries = await this.loadEntries(manifest)
      const matches: IndexSearchResult[] = []

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const titles = this.extractTitles(entry, manifest.extraction)

        for (const title of titles) {
          if (!title.toLowerCase().includes(q)) continue
          matches.push({ title, index: i })
          break
        }
      }

      if (matches.length) {
        result[id] = matches
      }
    }

    return result
  }

  async getEntry(
    id: string,
    index: number,
  ): Promise<Record<string, unknown> | null> {
    const manifest = this.indexFiles.get(id)
    if (!manifest) return null

    const entries = await this.loadEntries(manifest)
    return entries[index] ?? null
  }

  private async loadEntries(
    manifest: IndexFileManifest,
  ): Promise<Record<string, unknown>[]> {
    const raw = await fs.readFile(manifest.filePath, 'utf-8')
    const json = JSON.parse(raw)

    const entries = this.resolvePath(json, manifest.extraction.entriesPath)

    if (!Array.isArray(entries)) {
      throw new Error(`Invalid entriesPath for index "${manifest.id}"`)
    }

    return entries
  }

  private extractTitles(entry: unknown, schema: IndexExtractionSchema) {
    const keys = Array.isArray(schema.title) ? schema.title : [schema.title]

    const titles: string[] = []

    keys.forEach((key) => {
      const value = this.resolvePath(entry, key)

      if (typeof value === 'string') {
        titles.push(value)
      } else if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v !== 'string') continue
          titles.push(v)
        }
      }
    })
    return titles
  }

  private resolvePath(obj: any, path: string): unknown {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
  }
}
