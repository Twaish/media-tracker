import {
  MediaProps,
  PersistedMedia,
} from '../../domain/entities/media'

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

export interface MediaPaginationOptions {
  page: number
  limit: number
}

export type MediaPaginationResult = {
  data: PersistedMedia[]
  pagination: {
    page: number
    limit: number
    totalPages: number
    totalItems: number
  }
}
