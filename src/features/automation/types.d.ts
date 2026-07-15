import { PersistedRule, PersistedTemplate } from '@shared/types'

type Selected =
  | {
      type: 'rule'
      item: PersistedRule
    }
  | {
      type: 'template'
      item: PersistedTemplate
    }
  | null
