import { ThemeManifest } from '../models/ThemeManifest'
import { ThemeSummary } from '../models/ThemeSummary'

export interface IThemeRegistry {
  register(theme: ThemeManifest): void
  getIconPath(id: string): string | null
  get(id: string): ThemeManifest
  getAll(): ThemeManifest[]
  getAllSummaries(): ThemeSummary[]
  has(id: string): boolean
}
