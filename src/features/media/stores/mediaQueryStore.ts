import { create } from 'zustand'

interface MediaQueryState {
  page: number
  limit: number
  search: string
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSearch: (search: string) => void
}

export const useMediaQueryStore = create<MediaQueryState>()((set) => ({
  page: 1,
  limit: 10,
  search: '',
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ page: 1, search }),
}))
