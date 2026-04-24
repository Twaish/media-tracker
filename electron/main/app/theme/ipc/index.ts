import { os } from '@orpc/server'
import { themeModes } from '@shared/constants'
import { nativeTheme } from 'electron'
import z from 'zod'

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
