import { immer } from 'zustand/middleware/immer'
import { create } from 'zustand'

export type SettingValue = string | number

interface PluginSettingsStore {
  pending: Record<string, Record<string, SettingValue>>
  original: Record<string, Record<string, SettingValue>>

  setPending: (
    pluginId: string,
    fieldId: string,
    value: SettingValue,
    originalValue: SettingValue,
  ) => void
  reset: (pluginId: string) => void
  commit: (pluginId: string) => void
  isDirty: (pluginId: string) => boolean
}

export const usePluginSettingsStore = create<PluginSettingsStore>()(
  immer((set, get) => ({
    pending: {},
    original: {},

    setPending(pluginId, fieldId, value, originalValue) {
      set((s) => {
        if (!s.pending[pluginId]) s.pending[pluginId] = {}
        if (!s.original[pluginId]) s.original[pluginId] = {}

        if (!(fieldId in s.original[pluginId])) {
          s.original[pluginId][fieldId] = originalValue
        }

        s.pending[pluginId][fieldId] = value
      })
    },

    reset(pluginId) {
      set((s) => {
        delete s.pending[pluginId]
        delete s.original[pluginId]
      })
    },

    commit(pluginId) {
      set((s) => {
        delete s.pending[pluginId]
        delete s.original[pluginId]
      })
    },

    isDirty(pluginId) {
      const pending = get().pending[pluginId]
      const original = get().original[pluginId]
      if (!pending || !original) return false
      return Object.keys(pending).some((k) => pending[k] !== original[k])
    },
  })),
)
