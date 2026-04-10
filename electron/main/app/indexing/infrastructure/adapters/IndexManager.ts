import fs from 'fs/promises'
import fsSync from 'fs'
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
    if (!manifest.source || !this.isUrl(manifest.source)) return false

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

    const filePath = path.join(packageDir, `${id}.json`)
    const lastModified = await this.downloadOrCopyFile(source, filePath)

    return await this.persistManifest({
      id,
      name: id,
      filePath,
      source,
      importedAt: new Date(),
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      enabled: true,
      extraction,
    })
  }

  async refreshIndexFile(id: string): Promise<IndexFileManifest> {
    const manifest = this.indexRegistry.get(id)
    if (!manifest.source || !this.isUrl(manifest.source)) {
      throw new Error(`Index "${id}" has no remote source to refresh from`)
    }

    const lastModified = await this.downloadOrCopyFile(
      manifest.source,
      manifest.filePath,
    )

    return await this.persistManifest({
      ...manifest,
      importedAt: new Date(),
      lastModified: lastModified ? new Date(lastModified) : new Date(),
    })
  }

  private deriveId(source: string): string {
    const fileName = source.split(/[\\/]/).pop() ?? source
    return fileName.replace(/\.[^/.]+$/, '') // remove extension
  }

  private isUrl(value: string): boolean {
    return /^https?:\/\//.test(value)
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

    return manifest
  }

  private async downloadOrCopyFile(
    source: string,
    destPath: string,
  ): Promise<string | null> {
    if (this.isUrl(source)) {
      const res = await fetch(source)
      if (!res.ok)
        throw new Error(`Failed to download index file: ${res.status}`)
      await fs.writeFile(destPath, Buffer.from(await res.arrayBuffer()))
      return res.headers.get('last-modified')
    } else {
      await fs.copyFile(source, destPath)
      return null
    }
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
}
