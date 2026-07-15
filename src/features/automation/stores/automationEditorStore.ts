import { create } from 'zustand'
import { useAutomationStore } from './automationStore'
import {
  removeRules,
  removeTemplates,
  updateRule,
  updateTemplate,
} from '../actions'
import { Selected } from '../types'

type AutomationEditorStore = {
  source: string
  dirty: boolean

  setSource: (source: string) => void
  reset: () => void
  loadSelected: (selected: Selected) => void
  save: () => Promise<void>
  remove: () => Promise<void>
}

export const useAutomationEditorStore = create<AutomationEditorStore>(
  (set, get) => ({
    source: '',
    dirty: false,

    setSource: (source) =>
      set({
        source,
        dirty: true,
      }),

    reset: () =>
      set({
        source: '',
        dirty: false,
      }),

    loadSelected: (selected) => {
      if (!selected) {
        set({
          source: '',
          dirty: false,
        })
        return
      }

      set({
        source: selected.item.source,
        dirty: false,
      })
    },

    save: async () => {
      const { selected, load } = useAutomationStore.getState()
      const { source } = get()

      if (!selected) return

      if (selected.type === 'rule') {
        await updateRule({
          id: selected.item.id,
          source,
        })
      } else {
        await updateTemplate({
          id: selected.item.id,
          source,
        })
      }

      await load()

      set({ dirty: false })
    },

    remove: async () => {
      const { selected, setSelected, load } = useAutomationStore.getState()

      if (!selected) return

      if (!confirm(`Delete ${selected.type} "${selected.item.name}"?`)) {
        return
      }

      if (selected.type === 'rule') {
        await removeRules([selected.item.id])
      } else {
        await removeTemplates([selected.item.id])
      }

      setSelected(null)
      await load()

      set({
        source: '',
        dirty: false,
      })
    },
  }),
)
