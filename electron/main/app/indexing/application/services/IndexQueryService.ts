import fs from 'fs/promises'
import {
  IndexExtractionSchema,
  IndexFileManifest,
} from '../models/IndexFileManifest'
import { IIndexRegistry, IndexSearchResult } from '../ports/IIndexRegistry'
import { IIndexQueryService } from '../interfaces/IIndexQueryService'

export class IndexQueryService implements IIndexQueryService {
  constructor(private readonly registry: IIndexRegistry) {}

  async getEntry(
    id: string,
    index: number,
  ): Promise<Record<string, unknown> | null> {
    const manifest = this.registry.get(id)
    if (!manifest) return null

    const entries = await this.loadEntries(manifest)
    return entries[index] ?? null
  }

  async search(query: string, ids?: string[]) {
    const result: Record<string, IndexSearchResult[]> = {}
    ids = ids ?? Array.from(this.registry.getAll().map((i) => i.id))
    const q = query.toLowerCase()

    for (const id of ids) {
      const manifest = this.registry.get(id)
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
