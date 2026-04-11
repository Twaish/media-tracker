/**
 * Determines how to access entries at the import/refresh stage and other properties.
 *
 * Using the following schema
 * ```
 * { entriesPath: "nested.data", title: ["title", "synonyms"] }
 * ```
 * in an index file like this:
 * ```
 * {
 *   "nested": { "data": [ { title: "One Punch Man", synonyms: ["OPM"] }, ...] }
 * }
 * ```
 * would result in the following .jsonl file
 * ```
 * { title: "One Punch Man", synonyms: ["OPM"] }
 * { title: ... }
 * ```
 * and data looking like this when extracted
 * ```
 * ["One Punch Man", "OPM"]
 * ```
 */
export type IndexExtractionSchema = {
  entriesPath?: string // Key path to list of entries (only used at importing/refresh stage)
  title: string | string[] // Keys for which values to search for every entry (title, alternate titles)
}

export type IndexFileManifest = {
  id: string
  name: string
  filePath: string
  source: string
  version?: string
  importedAt: Date
  lastModified?: Date // source last modified
  enabled: boolean

  extraction: IndexExtractionSchema
}
