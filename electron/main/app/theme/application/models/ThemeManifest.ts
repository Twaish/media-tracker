import type { ThemeId, ThemeTokenMap } from '@shared/types'

export type ThemeManifest = {
  id: ThemeId
  name: string
  icon?: string
  colors: ThemeTokenMap
}
