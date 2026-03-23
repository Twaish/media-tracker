export type ThemeMode = 'dark' | 'light' | 'system'
export interface ThemeModeContext {
  toggle(): Promise<boolean>
  dark(): Promise<string>
  light(): Promise<string>
  system(): Promise<boolean>
  current(): Promise<ThemeMode>
}
