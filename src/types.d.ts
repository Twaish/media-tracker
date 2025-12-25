// Preload types
interface ThemeModeContext {
  toggle: () => Promise<boolean>
  dark: () => Promise<void>
  light: () => Promise<void>
  system: () => Promise<boolean>
  current: () => Promise<'dark' | 'light' | 'system'>
}
interface ElectronWindow {
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
}

declare interface Window {
  themeMode: ThemeModeContext
  electronWindow: ElectronWindow
}
