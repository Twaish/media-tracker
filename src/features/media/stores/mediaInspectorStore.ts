import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type MediaInspectorState = {
  selectedMedia: number | null
  selectMedia(id: number | null): void
}

export const useMediaInspectorStore = create<MediaInspectorState>()(
  immer((set) => ({
    selectedMedia: null,
    selectMedia(id: number | null) {
      set({ selectedMedia: id })
    },
  })),
)
