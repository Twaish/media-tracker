import { SearchQuery } from '../../domain/query/SearchQuery'

export interface IQueryResolver {
  /**
   * Processes queries into ASTs
   *
   * Example:
   *
   * `One punch [Genre=Comedy, Fighting][Year>=2015][Genre!=Thriller] man`
   *
   * the result:
   * ```json
   * {
   *   "title": "One punch man",
   *   "filters": [
   *     { "field": "genre", "op": "=", "values": ["Comedy", "Fighting"] },
   *     { "field": "year", "op": ">=", "values": [2015] },
   *     { "field": "genre", "op": "!=", "values": ["Thriller"] }
   *   ]
   * }
   * ```
   * @param query
   */
  resolve(query: string): SearchQuery
}
