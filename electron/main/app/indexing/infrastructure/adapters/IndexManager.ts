import fs from 'fs/promises'
import fsSync from 'fs'
import readline from 'readline/promises'
import path from 'path'
import { IIndexManager } from '../../application/ports/IIndexManager'
import { IIndexRegistry } from '../../application/ports/IIndexRegistry'
import {
  IndexExtractionSchema,
  IndexFileManifest,
} from '../../application/models/IndexFileManifest'
import EventEmitter from 'events'

export class IndexManager extends EventEmitter implements IIndexManager {
  constructor(
    private readonly basePath: string,
    private readonly indexRegistry: IIndexRegistry,
  ) {
    super()
  }

  async disableIndexFile(id: string): Promise<IndexFileManifest> {
    const manifest = this.indexRegistry.get(id)
    return await this.persistManifest({ ...manifest, enabled: false })
  }

  async enableIndexFile(id: string): Promise<IndexFileManifest> {
    const manifest = this.indexRegistry.get(id)
    return await this.persistManifest({ ...manifest, enabled: true })
  }

  async updateExtractionSchema(params: {
    id: string
    extraction: IndexExtractionSchema
  }): Promise<IndexFileManifest> {
    const { id, extraction } = params
    const manifest = this.indexRegistry.get(id)
    return await this.persistManifest({ ...manifest, extraction })
  }

  async load(): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true })
    const dirs = await fs.readdir(this.basePath)

    for (const dir of dirs) {
      try {
        const manifest = await this.loadManifest(path.join(this.basePath, dir))
        if (!manifest.enabled) continue

        this.indexRegistry.register(manifest)
      } catch (err) {
        this.emit(
          'error',
          new Error(
            `Failed loading index file "${dir}": ${err instanceof Error ? err.stack : String(err)}`,
          ),
        )
      }
    }
  }

  async isOutdated(id: string): Promise<boolean> {
    const manifest = this.indexRegistry.get(id)
    if (!this.isUrl(manifest.source)) return false

    const res = await fetch(manifest.source, { method: 'HEAD' })
    if (!res.ok) throw new Error(`Failed to check index: ${res.status}`)

    const lastModified = res.headers.get('last-modified')
    if (!lastModified) return false

    const remoteDate = new Date(lastModified)
    const localDate = manifest.lastModified
      ? new Date(manifest.lastModified)
      : new Date(manifest.importedAt)

    return remoteDate > localDate
  }

  async importIndexFile(params: {
    source: string
    extraction: IndexExtractionSchema
  }): Promise<IndexFileManifest> {
    const { source, extraction } = params
    const id = this.deriveId(source)

    if (this.findDuplicate(source, id)) {
      throw new Error(
        `Duplicate index detected (id="${id}", source="${source}")`,
      )
    }

    const packageDir = path.join(this.basePath, id)
    await fs.mkdir(packageDir, { recursive: true })

    const filePath = path.join(packageDir, `${id}.jsonl`)
    const lastModified = await this.downloadOrCopyFile(
      source,
      filePath,
      extraction,
    )
    const totalEntries = await this.getTotalEntries(filePath)

    return await this.persistManifest({
      id,
      name: id,
      filePath,
      source,
      importedAt: new Date(),
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      enabled: true,
      extraction,
      totalEntries,
    })
  }

  async removeIndexPackage(id: string): Promise<void> {
    const manifest = this.indexRegistry.get(id)

    const packageDir = path.dirname(manifest.filePath)

    try {
      this.indexRegistry.unregister(id)

      await fs.rm(packageDir, { recursive: true })
    } catch (err) {
      this.emit(
        'error',
        new Error(
          `Failed to remove index file "${err}": ${err instanceof Error ? err.stack : String(err)}`,
        ),
      )
      throw err
    }
  }

  async refreshIndexFile(id: string): Promise<IndexFileManifest> {
    const manifest = this.indexRegistry.get(id)

    if (!(await this.isOutdated(id))) {
      return manifest
    }

    const lastModified = await this.downloadOrCopyFile(
      manifest.source,
      manifest.filePath,
      manifest.extraction,
    )
    const totalEntries = await this.getTotalEntries(manifest.filePath)

    return await this.persistManifest({
      ...manifest,
      importedAt: new Date(),
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      totalEntries,
    })
  }

  private deriveId(source: string): string {
    return path.basename(source, path.extname(source))
  }

  private isUrl(value: string): boolean {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  }

  private findDuplicate(source: string, id: string): IndexFileManifest | null {
    const all = this.indexRegistry.getAll()

    return (
      all.find((m) => m.id === id || (m.source && m.source === source)) ?? null
    )
  }

  private async loadManifest(dir: string): Promise<IndexFileManifest> {
    const manifest = JSON.parse(
      await fs.readFile(path.join(dir, 'manifest.json'), 'utf-8'),
    ) as IndexFileManifest

    const missingError = (message: string) => {
      throw new Error(`Index package at ${dir} is missing ${message}`)
    }

    if (!manifest.id) missingError('a required id')
    if (!manifest.filePath) missingError('a required file path')
    if (!manifest.extraction) missingError('a required extraction schema')
    if (!fsSync.existsSync(manifest.filePath)) missingError('the index file')
    if (manifest.lastModified) {
      manifest.lastModified = new Date(manifest.lastModified)
    }
    manifest.importedAt = new Date(manifest.importedAt)

    return manifest
  }

  private async downloadOrCopyFile(
    source: string,
    destPath: string,
    extraction: IndexExtractionSchema,
  ): Promise<string | null> {
    let lastModified: string | null = null
    let rawBuffer: Buffer

    const isUrl = this.isUrl(source)
    if (isUrl) {
      const res = await fetch(source)
      if (!res.ok)
        throw new Error(`Failed to download index file: ${res.status}`)
      rawBuffer = Buffer.from(await res.arrayBuffer())
      lastModified = res.headers.get('last-modified')
    } else {
      rawBuffer = await fs.readFile(source)
    }

    const pathname = isUrl ? new URL(source).pathname : source
    const ext = path.extname(pathname) || '.jsonl'
    if (ext === '.jsonl') {
      await fs.writeFile(destPath, rawBuffer)
    } else {
      await this.convertJsonToJsonl(
        rawBuffer.toString('utf-8'),
        destPath,
        extraction,
      )
    }

    return lastModified
  }

  private async convertJsonToJsonl(
    raw: string,
    destPath: string,
    extraction: IndexExtractionSchema,
  ): Promise<void> {
    if (!extraction.entriesPath) {
      throw new Error(`Missing required entriesPath`)
    }

    const json = JSON.parse(raw)
    const entries = this.resolvePath(json, extraction.entriesPath)

    if (!Array.isArray(entries)) {
      throw new Error(
        `Invalid entriesPath "${extraction.entriesPath}": resolved value is not an array`,
      )
    }

    const lines = entries.map((entry) => JSON.stringify(entry)).join('\n')
    await fs.writeFile(destPath, lines, 'utf-8')
  }

  private async getTotalEntries(filePath: string): Promise<number> {
    const fileStream = fsSync.createReadStream(filePath)
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    let total = 0
    try {
      for await (const line of rl) {
        if (line.trim()) total++
      }
    } finally {
      rl.close()
      fileStream.destroy()
    }
    return total
  }

  private async persistManifest(
    manifest: IndexFileManifest,
  ): Promise<IndexFileManifest> {
    const manifestPath = path.join(
      path.dirname(manifest.filePath),
      'manifest.json',
    )
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
    this.indexRegistry.unregister(manifest.id)
    this.indexRegistry.register(manifest)
    return manifest
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
