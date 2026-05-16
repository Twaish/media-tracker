import { closeModal, openModal } from '@/stores/modal/modalStore'

import { PersistedMedia } from '@shared/types'
import { MediaDialog } from '../components/MediaDialog'
import { create } from 'zustand'

type MediaEditState = {
  isDirty: boolean
  draft: Partial<PersistedMedia>
  original: Partial<PersistedMedia>
  updateMedia: (patch: Partial<PersistedMedia>) => void
  load: (media: Partial<PersistedMedia>) => void
  reset: () => void
}

export const useMediaEditStore = create<MediaEditState>((set) => ({
  isDirty: false,
  draft: {},
  original: {},
  updateMedia: (patch) =>
    set((s) => {
      const next = { ...s.draft, ...patch }
      const isDirty = (Object.keys(next) as (keyof PersistedMedia)[]).some(
        (key) => next[key] !== s.original[key],
      )
      return { draft: next, isDirty }
    }),
  load: (media) =>
    set({ isDirty: false, draft: { ...media }, original: { ...media } }),
  reset: () => set((s) => ({ isDirty: false, draft: { ...s.original } })),
}))

interface UseMediaDialogOptions {
  onEdit?: (media: Partial<PersistedMedia>) => void
  onAdd?: (media: Partial<PersistedMedia>) => void
  defaultMedia?: Partial<PersistedMedia>
}

export const openMediaDialog = ({
  onEdit,
  onAdd,
  defaultMedia,
}: UseMediaDialogOptions = {}) => {
  openModal(
    <MediaDialog
      onEdit={onEdit}
      onAdd={onAdd}
      mediaId={defaultMedia?.id}
      store={useMediaEditStore}
    />,
  )
}

export const closeMediaDialog = () => {
  closeModal()
}

export const mediaDialogActions = {
  add: (options: UseMediaDialogOptions = {}) => {
    useMediaEditStore.getState().load({
      type: 'anime',
      status: 'plan-to-watch',
      currentEpisode: 0,
    })
    openMediaDialog(options)
  },
  edit: (
    media: Partial<PersistedMedia>,
    options: UseMediaDialogOptions = {},
  ) => {
    useMediaEditStore.getState().load(media)
    openMediaDialog({ ...options, defaultMedia: media })
  },
}

export function useMediaDialog(options: UseMediaDialogOptions = {}) {
  return {
    add: () => mediaDialogActions.add(options),
    edit: (media: Partial<PersistedMedia>) =>
      mediaDialogActions.edit(media, options),
  }
}
