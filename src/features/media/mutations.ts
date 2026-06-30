import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/core/queryClient'
import { removeMedia, updateMedia } from './actions'
import { queryKeys } from './queries'
import { useMediaStore } from './stores/mediaStore'
import { PersistedMedia } from '@shared/types'

export const useRemoveMedia = () =>
  useMutation({
    mutationFn: (id: number) => removeMedia([id]),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.all() }),
  })

export const useUpdateMedia = () => {
  const setMedia = useMediaStore((s) => s.setMedia)

  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: number
      patch: Partial<PersistedMedia>
    }) =>
      updateMedia({
        id,
        ...patch,
        genres: patch.genres?.map((g) => g.id),
      }),
    onSuccess: (updatedMedia) => {
      if (!updatedMedia) return

      setMedia(updatedMedia)
      queryClient.invalidateQueries({
        queryKey: queryKeys.getMediaById(updatedMedia.id),
      })
    },
  })
}
