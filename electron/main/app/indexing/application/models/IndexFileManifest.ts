export type IndexExtractionSchema = {
  entriesPath: string // Key path to list of entries
  title: string | string[] // Keys for which values to search for every entry (title, alternate titles)
}

export type IndexFileManifest = {
  id: string
  name: string
  filePath: string
  source?: string
  version?: string
  importedAt: Date
  lastModified: Date // source last modified
  enabled: boolean

  extraction: IndexExtractionSchema
}
