import { Modules } from '@/helpers/ipc/types'
import { os } from '@orpc/server'
import { nativeTheme } from 'electron'
import z from 'zod'
import {
  currentOutputSchema,
  getSystemThemeOutputSchema,
  getThemeInputSchema,
  getThemesOutputSchema,
  systemOutputSchema,
  toggleOutputSchema,
} from './schemas'

const themeSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
})

const themeDefinitionSchema = themeSummarySchema.extend({
  colors: z.record(z.string(), z.string()),
})

export function createThemeRouters(modules: Modules) {
  const getThemeWithFallback = (themeId?: string | null) => {
    if (themeId && modules.ThemeRegistry.has(themeId)) {
      return modules.ThemeRegistry.get(themeId)
    }
    return modules.ThemeRegistry.get('light')
  }

  return {
    getThemes: os
      .output(getThemesOutputSchema)
      .handler(() => modules.ThemeRegistry.getAllSummaries()),
    getTheme: os
      .input(getThemeInputSchema)
      .output(themeDefinitionSchema)
      .handler(({ input }) => getThemeWithFallback(input)),
    current: os
      .output(currentOutputSchema)
      .handler(() => nativeTheme.themeSource),
    toggle: os.output(toggleOutputSchema).handler(() => {
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      return nativeTheme.shouldUseDarkColors
    }),
    getSystemTheme: os.output(getSystemThemeOutputSchema).handler(() => {
      const previous = nativeTheme.themeSource

      nativeTheme.themeSource = 'system'
      const isDark = nativeTheme.shouldUseDarkColors

      nativeTheme.themeSource = previous

      return isDark ? 'dark' : 'light'
    }),
    dark: os.handler(() => (nativeTheme.themeSource = 'dark')),
    light: os.handler(() => (nativeTheme.themeSource = 'light')),
    system: os.output(systemOutputSchema).handler(() => {
      nativeTheme.themeSource = 'system'
      return nativeTheme.shouldUseDarkColors
    }),
  }
}
