import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import {
  getMedia,
  getMediaById,
  removeMedia,
  resolveExternalMediaLink,
  searchMedia,
} from './actions'
import { queryClient } from '@/core/queryClient'

export const queryKeys = {
  all: () => ['media'],
  getMedia: (query: string, page: number, limit: number) => [
    ...queryKeys.all(),
    'list',
    { query },
    { page },
    { limit },
  ],
  getMediaById: (id: number) => [...queryKeys.all(), 'one', { id }],
  resolveExternalMediaLink: (id: number) => [
    ...queryKeys.all(),
    'resolveLink',
    { id },
  ],
}

export const getMediaQueryOptions = (
  query: string = '',
  page: number = 1,
  limit: number = 12,
) =>
  queryOptions({
    queryKey: queryKeys.getMedia(query, page, limit),
    queryFn: () => searchMedia(query, { page, limit }),
  })

export const getMediaByIdQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.getMediaById(id),
    queryFn: () => getMediaById(id),
  })

export const resolveExternalMediaLinkQueryOptions = (id: number) =>
  queryOptions({
    queryKey: queryKeys.resolveExternalMediaLink(id),
    queryFn: () => resolveExternalMediaLink(id),
  })
