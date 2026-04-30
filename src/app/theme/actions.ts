import { ipc } from '@/core/ipc'
import { useModalStore } from '@/stores/modal/modalStore'
import { ThemeId, ThemeMode, ThemeTokenMap } from '@shared/types'
import { closeSelectTheme, openSelectTheme } from './hooks/useSelectTheme'
import { darkTheme, lightTheme } from './data/defaultThemes'
import { themeModes } from '@shared/constants'

const THEME_KEY = 'theme'
const THEME_CLASS_KEY = 'theme-class'

export interface Theme {
  id: ThemeId
  name: string
  icon?: string
  className?: string
  colors?: ThemeTokenMap
}

export interface ThemePreferences {
  system: ThemeMode
  local: ThemeId | null
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.themeMode.current()
  const localTheme = localStorage.getItem(THEME_KEY) as ThemeId | null

  return {
    system: currentTheme,
    local: localTheme,
  }
}

export async function setTheme(themeId: ThemeId) {
  let resolvedTheme: Theme

  if (themeId === 'dark') {
    await ipc.client.themeMode.dark()
    resolvedTheme = darkTheme
  } else if (themeId === 'light') {
    await ipc.client.themeMode.light()
    resolvedTheme = lightTheme
  } else if (themeId === 'system') {
    const isDarkMode = await ipc.client.themeMode.system()
    resolvedTheme = isDarkMode ? darkTheme : lightTheme
  } else {
    try {
      resolvedTheme = await ipc.client.themeMode.getTheme(themeId)
    } catch {
      setTheme('system')
      return
    }
  }

  applyTheme(resolvedTheme)
  localStorage.setItem(THEME_KEY, themeId)
}

export async function getThemes() {
  return ipc.client.themeMode.getThemes()
}

export async function getSystemTheme() {
  return ipc.client.themeMode.getSystemTheme()
}

export async function syncThemeWithLocal() {
  const { local } = await getCurrentTheme()
  await setTheme(local ?? 'system')
}

export function isDefaultTheme(themeId: ThemeId): themeId is ThemeMode {
  return (themeModes as readonly string[]).includes(themeId)
}

export async function getThemeStyleObject(themeId: ThemeId) {
  const theme = await ipc.client.themeMode.getTheme(themeId)
  const tokens = theme.colors

  if (!tokens) return {}

  const style: React.CSSProperties & {
    [key: `--${string}`]: string
  } = {}

  for (const [token, value] of Object.entries(tokens)) {
    style[`--${token}` as any] = value
  }

  return style
}

function applyTheme(resolvedTheme: Theme) {
  const body = document.body

  const previous = localStorage.getItem(THEME_CLASS_KEY)
  if (previous) {
    body.classList.remove(previous)
  }

  if (resolvedTheme.className) {
    body.classList.add(resolvedTheme.className)
    localStorage.setItem(THEME_CLASS_KEY, resolvedTheme.className)
  } else {
    localStorage.removeItem(THEME_CLASS_KEY)
  }

  clearThemeVariables()

  if (resolvedTheme.colors) {
    applyThemeVariables(resolvedTheme.colors)
  }
}

function applyThemeVariables(tokens: ThemeTokenMap) {
  for (const [token, value] of Object.entries(tokens)) {
    document.body.style.setProperty(`--${token}`, value)
  }
}

function clearThemeVariables() {
  const style = document.body.style

  for (let i = style.length - 1; i >= 0; i--) {
    const prop = style[i]
    if (prop.startsWith('--')) {
      style.removeProperty(prop)
    }
  }
}

export function toggleSelectTheme() {
  if (useModalStore.getState().isOpen) {
    closeSelectTheme()
  } else {
    openSelectTheme()
  }
}
