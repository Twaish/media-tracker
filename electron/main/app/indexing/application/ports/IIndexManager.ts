import {
  IndexExtractionSchema,
  IndexFileManifest,
} from '../models/IndexFileManifest'

export interface IIndexManager {
  /**
   * Loads stored index packages to index registry
   */
  load(): Promise<void>

  /**
   * Import a local index file or a remote source index file by URL
   *
   * @param source The file source
   * @param extraction The extraction schema
   */
  importIndexFile(params: {
    source: string // file path or url
    extraction: IndexExtractionSchema
  }): Promise<IndexFileManifest>

  /**
   * Remove a stored index package by its id
   *
   * @param id The index package id
   */
  removeIndexPackage(id: string): Promise<void>

  /**
   * Update the extraction schema for an index package
   *
   * @param id The index package id
   * @param extraction The new extraction schema
   */
  updateExtractionSchema(params: {
    id: string
    extraction: IndexExtractionSchema
  }): Promise<IndexFileManifest>

  /**
   * Determines whether a remote source index file is outdated
   *
   * @param id The remote source index package id
   */
  isOutdated(id: string): Promise<boolean>

  /**
   * Re-downloads remote source index files
   *
   * @param id The index package id
   */
  refreshIndexFile(id: string): Promise<IndexFileManifest>

  /**
   * Disable an index file excluding it from search
   *
   * @param id The index package id
   */
  disableIndexFile(id: string): Promise<IndexFileManifest>

  /**
   * Enable an index file including it in search
   *
   * @param id The index package id
   */
  enableIndexFile(id: string): Promise<IndexFileManifest>
}
