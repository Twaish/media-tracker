import { IThemeRegistry } from '../../application/ports/IThemeRegistry'
import { ThemeManifest } from '../../application/models/ThemeManifest'
import { ThemeSummary } from '../../application/models/ThemeSummary'

export class ThemeRegistry implements IThemeRegistry {
  private themes = new Map<string, ThemeManifest>()

  register(theme: ThemeManifest): void {
    this.themes.set(theme.id, theme)
  }

  getIconPath(id: string): string | null {
    const theme = this.themes.get(id)
    if (!theme?.icon) return null
    return theme.icon
  }

  get(id: string): ThemeManifest {
    const theme = this.themes.get(id)
    if (!theme) {
      throw new Error(`Theme "${id}" is not registered`)
    }
    return theme
  }

  getAll(): ThemeManifest[] {
    return Array.from(this.themes.values())
  }

  getAllSummaries(): ThemeSummary[] {
    return this.getAll().map((item) => {
      const { colors, ...rest } = item
      return rest
    })
  }

  has(id: string): boolean {
    return this.themes.has(id)
  }
}
