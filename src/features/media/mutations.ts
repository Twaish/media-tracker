import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/core/queryClient'
import { removeMedia } from './actions'
import { queryKeys } from './queries'

export const useRemoveMedia = () =>
  useMutation({
    mutationFn: (id: number) => removeMedia([id]),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.all() }),
  })
