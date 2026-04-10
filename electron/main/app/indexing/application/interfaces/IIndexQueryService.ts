export type IndexSearchResult = {
  title: string
  index: number
}

export interface IIndexQueryService {
  /**
   * Search index files
   *
   * @param query The text to search for
   * @param ids The ids for which index files to use
   */
  search(
    query: string,
    ids?: string[],
  ): Promise<Record<string, IndexSearchResult[]>>

  /**
   * Get the full entry from an index file by its id and index in the entry array
   *
   * @param id The id for the index file
   * @param index The index for the entry to retrieve
   */
  getEntry(id: string, index: number): Promise<Record<string, unknown> | null>
}
