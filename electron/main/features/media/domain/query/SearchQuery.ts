import { Filter } from './Filter'

export interface SearchQuery {
  title: string
  filters: Filter[]
}
