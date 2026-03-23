import { SearchQuery } from '../services/QueryResolver'

export interface IQueryResolver {
  resolve(query: string): SearchQuery
}
