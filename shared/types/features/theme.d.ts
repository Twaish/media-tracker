import { themeModes, themeTokens } from '@shared/constants'

export type ThemeMode = (typeof themeModes)[number]
export type ThemeToken = (typeof themeTokens)[number]
export type ThemeTokenMap = Partial<Record<ThemeToken, string>>

export type ThemeId = ThemeMode | (string & {})
