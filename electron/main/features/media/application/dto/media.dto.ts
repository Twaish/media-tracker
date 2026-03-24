import { Pagination } from '@shared/types'
import { MediaProps } from '../../domain/entities/media'
import { Filter } from '../../domain/query/Filter'

export type AddMediaDTO = Omit<
  MediaProps,
  'genres' | 'createdAt' | 'lastUpdated' | 'deletedAt'
> & {
  genres: number[]
}
export type UpdateMediaDTO = Partial<AddMediaDTO> & {
  id: number
}

export type BulkUpdateMediaDTO = {
  ids: number[]

  update?: Partial<Omit<UpdateMediaDTO, 'id' | 'genres'>>

  add?: {
    genres?: number[]
  }

  remove?: {
    genres?: number[]
  }
}

export type MediaSearchOptions = {
  title?: string
  filters?: Filter[]
  pagination?: Pagination
}
