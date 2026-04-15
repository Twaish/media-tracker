import fsSync from 'fs'
import readline from 'readline/promises'
import { IndexExtractionSchema } from '../models/IndexFileManifest'
import { IIndexRegistry } from '../ports/IIndexRegistry'
import {
  IIndexQueryService,
  IndexSearchResult,
} from '../interfaces/IIndexQueryService'
import { Pagination, PaginationResult } from '@shared/types'

export class IndexQueryService implements IIndexQueryService {
  constructor(private readonly registry: IIndexRegistry) {}

  async getEntry(
    id: string,
    index: number,
  ): Promise<Record<string, unknown> | null> {
    const manifest = this.registry.get(id)
    if (!manifest) return null

    for await (const item of this.streamJsonl({
      filePath: manifest.filePath,
      skipLines: manifest.extraction.skipLines ?? 0,
    })) {
      if (item.index === index) return item.entry
    }

    return null
  }

  async getEntries(
    id: string,
    options?: Pagination,
  ): Promise<PaginationResult<Record<string, unknown>>> {
    const { page = 1, limit = 10 } = options ?? {}
    const manifest = this.registry.get(id)
    if (!manifest)
      return {
        data: [],
        pagination: { page: 0, limit: 0, totalPages: 0, totalItems: 0 },
      }

    const { totalEntries: totalItems } = manifest
    const offset = (page - 1) * limit
    const entries: Record<string, unknown>[] = []

    for await (const { entry, index } of this.streamJsonl({
      filePath: manifest.filePath,
      startAtIndex: offset,
      skipLines: manifest.extraction.skipLines ?? 0,
    })) {
      if (index >= offset + limit) break
      entries.push(entry)
    }

    const totalPages = Math.ceil(totalItems / limit)

    return {
      data: entries,
      pagination: {
        page,
        limit,
        totalPages,
        totalItems,
      },
    }
  }

  async search(query: string, ids?: string[]) {
    const result: Record<string, IndexSearchResult[]> = {}
    ids = ids ?? Array.from(this.registry.getAll().map((i) => i.id))
    const q = query.toLowerCase()

    for (const id of ids) {
      const manifest = this.registry.get(id)
      if (!manifest?.enabled) continue

      const matches: IndexSearchResult[] = []
      for await (const { entry, index } of this.streamJsonl({
        filePath: manifest.filePath,
        skipLines: manifest.extraction.skipLines ?? 0,
      })) {
        const titles = this.extractTitles(entry, manifest.extraction)
        for (const title of titles) {
          if (!title.toLowerCase().includes(q)) continue
          matches.push({ title, index })
          break
        }
      }

      if (matches.length) result[id] = matches
    }

    return result
  }

  private async *streamJsonl({
    filePath,
    startAtIndex = 0,
    skipLines = 0,
  }: {
    filePath: string
    startAtIndex?: number
    skipLines?: number
  }): AsyncGenerator<{ entry: Record<string, unknown>; index: number }> {
    const fileStream = fsSync.createReadStream(filePath, {
      encoding: 'utf-8',
    })
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    let index = 0
    let skipped = 0
    try {
      for await (const line of rl) {
        if (!line.trim()) continue
        if (skipped < skipLines) {
          skipped++
          continue
        }
        if (index >= startAtIndex) {
          yield { entry: JSON.parse(line), index }
        }
        index++
      }
    } finally {
      rl.close()
      fileStream.destroy()
    }
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

  private resolvePath<T>(obj: T, path: string): unknown {
    return path
      .split('.')
      .reduce(
        (acc, key) => (acc as Record<string, unknown>)?.[key],
        obj as unknown,
      )
  }
}
