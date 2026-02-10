import { SearchQuery } from '@/domain/services/QueryResolver'

export interface SearchContext {
  resolveQuery: (query: string) => Promise<SearchQuery>
}
