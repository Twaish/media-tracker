import { os } from '@orpc/server'
import { nativeTheme } from 'electron'
import z from 'zod'

const themeModes = ['dark', 'light', 'system'] as const
export type ThemeMode = (typeof themeModes)[number]

export function createThemeRouters() {
  return {
    current: os
      .output(z.enum(themeModes))
      .handler(() => nativeTheme.themeSource),
    toggle: os.output(z.boolean()).handler(() => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      return nativeTheme.shouldUseDarkColors
    }),
    dark: os
      .output(z.string())
      .handler(() => (nativeTheme.themeSource = 'dark')),
    light: os
      .output(z.string())
      .handler(() => (nativeTheme.themeSource = 'light')),
    system: os.output(z.boolean()).handler(() => {
      nativeTheme.themeSource = 'system'
      return nativeTheme.shouldUseDarkColors
    }),
  }
}
