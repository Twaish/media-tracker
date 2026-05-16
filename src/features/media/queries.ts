import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { getMedia, getMediaById, removeMedia } from './actions'
import { queryClient } from '@/core/queryClient'

export const queryKeys = {
  all: () => ['media'],
  getMedia: (page: number, limit: number) => [
    ...queryKeys.all(),
    'list',
    { page },
    { limit },
  ],
  getMediaById: (id: number) => [...queryKeys.all(), 'one', { id }],
}

export const getMediaQueryOptions = (page: number = 1, limit: number = 12) =>
  queryOptions({
    queryKey: queryKeys.getMedia(page, limit),
    queryFn: () => getMedia({ page, limit }),
  })

export const getMediaByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.getMediaById(id),
    queryFn: () => getMediaById(id),
  })
