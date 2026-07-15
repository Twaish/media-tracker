import { create } from 'zustand'
import { getAllRules, getAllTemplates } from '../actions'
import { Selected } from '../types'
import { PersistedRule, PersistedTemplate } from '@shared/types'

type AutomationStore = {
  rules: PersistedRule[]
  templates: PersistedTemplate[]
  selected: Selected
  loading: boolean

  load: () => Promise<void>
  setSelected: (selected: Selected) => void
}

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  rules: [],
  templates: [],
  selected: null,
  loading: true,

  setSelected: (selected) => set({ selected }),

  load: async () => {
    const { rules: existingRules, templates: existingTemplates } = get()
    if (!existingRules.length || !existingTemplates.length) {
      set({ loading: true })
    }

    const [rules, templates] = await Promise.all([
      getAllRules(),
      getAllTemplates(),
    ])

    set({
      rules,
      templates,
      loading: false,
    })
  },
}))
