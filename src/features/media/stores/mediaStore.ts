import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PaginationInfo, PersistedMedia } from '@shared/types'

interface MediaState {
  media: Record<string, PersistedMedia>
  pagination?: PaginationInfo
  setPagination(pagination: PaginationInfo): void
  setMedias(entries: PersistedMedia[]): void
  setMedia(entry: PersistedMedia): void
}

export const useMediaStore = create<MediaState>()(
  immer((set) => ({
    media: {},
    pagination: { page: 0, limit: 0, totalItems: 0, totalPages: 0 },

    setPagination: (pagination: PaginationInfo) => {
      set({ pagination })
    },
    setMedias: (entries) =>
      set((state) => {
        for (const entry of entries) {
          if (!state.media[entry.id]) {
            state.media[entry.id] = entry
          }
        }
      }),

    setMedia: (entry) =>
      set((state) => {
        state.media[entry.id] = entry
      }),
  })),
)

export const selectMedia = (id: number) => (state: MediaState) =>
  state.media[id]

export const selectProp =
  <K extends keyof PersistedMedia>(id: number, property: K) =>
  (state: MediaState): PersistedMedia[K] =>
    state.media[id]?.[property]
