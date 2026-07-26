import { PersistedDelta } from '@shared/types'
import { create } from 'zustand'
import { getDeltas, removeDeltas } from '../actions'

type HistoryState = {
  items: PersistedDelta[]
  loading: boolean

  page: number
  limit: number
  totalItems: number
  totalPages: number

  selected: Set<number>

  load: () => Promise<void>
  setPage: (page: number) => Promise<void>
  setLimit: (limit: number) => Promise<void>

  remove: (ids: number[]) => Promise<void>
  removeSelected: () => Promise<void>

  toggleSelected: (id: number) => void
  toggleAllSelected: () => void
  clearSelected: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  loading: false,

  page: 1,
  limit: 25,
  totalItems: 0,
  totalPages: 0,

  selected: new Set(),

  async load() {
    const { page, limit } = get()

    set({ loading: true })

    const result = await getDeltas({ page, limit })
    const { totalPages, totalItems } = result.pagination

    if (totalPages > 0 && page > totalPages) {
      set({ page: totalPages })
      return get().load()
    }

    set({
      items: result.data,
      totalItems,
      totalPages,
      loading: false,
      selected: new Set(),
    })
  },

  async setPage(page) {
    set({ page })
    await get().load()
  },

  async setLimit(limit) {
    set({ limit })
    await get().load()
  },

  async remove(ids) {
    await removeDeltas(ids)
    await get().load()
  },

  async removeSelected() {
    const { selected, remove } = get()
    if (!selected.size) return
    await remove(Array.from(selected))
  },

  toggleSelected(id) {
    const next = new Set(get().selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    set({ selected: next })
  },

  toggleAllSelected() {
    const { items, selected } = get()
    const allSelected =
      items.length > 0 && items.every((i) => selected.has(i.id))
    set({ selected: allSelected ? new Set() : new Set(items.map((i) => i.id)) })
  },

  clearSelected() {
    set({ selected: new Set() })
  },
}))
