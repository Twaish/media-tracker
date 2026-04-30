export interface IThemeManager {
  load(themesPath: string): Promise<void>
}
