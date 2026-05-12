import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { PersistedMedia } from '@shared/types'
import { updateMedia as updateMediaAction } from '../actions'

interface MediaState {
  media: Record<string, PersistedMedia>
  setMedias(entries: PersistedMedia[]): void
  updateMedia(id: number, patch: Partial<PersistedMedia>): void
}

export const useMediaStore = create<MediaState>()(
  immer((set) => ({
    media: {},

    setMedias: (entries) =>
      set((state) => {
        for (const entry of entries) {
          if (!state.media[entry.id]) {
            state.media[entry.id] = entry
          }
        }
      }),

    updateMedia(id, patch) {
      set((state) => {
        if (state.media[id]) {
          Object.assign(state.media[id], patch)
          state.media[id].lastUpdated = new Date()
        }
      })

      let genreIds = patch.genres?.map((g) => g.id)

      const snapshot = useMediaStore.getState().media[id]

      updateMediaAction({ id, ...patch, genres: genreIds }).catch(() => {
        set((state) => {
          if (state.media[id] && snapshot) {
            state.media[id] = snapshot
          }
        })
      })
    },
  })),
)

export const selectMedia = (id: number) => (state: MediaState) =>
  state.media[id]

export const selectProp =
  <K extends keyof PersistedMedia>(id: number, property: K) =>
  (state: MediaState): PersistedMedia[K] =>
    state.media[id][property]
