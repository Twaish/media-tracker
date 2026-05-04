import { PluginEntry } from '@shared/types'
import { create } from 'zustand'
import { getPluginEntries } from '../actions'

export type Plugin = Omit<PluginEntry, 'error'> & { error?: string | null }

type PluginStore = {
  plugins: Plugin[]
  init: () => Promise<void>
  setPlugins: (plugins: Plugin[]) => void
  refresh: () => Promise<void>
}

export const usePluginStore = create<PluginStore>((set) => ({
  plugins: [],
  init: async () => {
    try {
      const plugins = await getPluginEntries()
      set({ plugins })
    } catch (err) {
      console.error(err)
    }
  },
  setPlugins: (plugins) => set({ plugins }),
  refresh: async () => {
    try {
      const plugins = await getPluginEntries()
      set({ plugins })
    } catch (err) {
      console.error(err)
    }
  },
}))
