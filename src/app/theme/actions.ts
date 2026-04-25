import { ipc } from '@/ipc'
import { ThemeMode } from '@shared/types'

const THEME_KEY = 'theme'
const THEME_RESOLVED_KEY = 'theme-resolved'

export type AppTheme = ThemeMode | (string & {})

export interface ThemePreferences {
  system: ThemeMode
  local: AppTheme | null
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.themeMode.current()
  const localTheme = localStorage.getItem(THEME_KEY) as AppTheme | null

  return {
    system: currentTheme,
    local: localTheme,
  }
}

export async function setTheme(newTheme: AppTheme) {
  let resolvedTheme = newTheme

  if (newTheme === 'dark') {
    await ipc.client.themeMode.dark()
  } else if (newTheme === 'light') {
    await ipc.client.themeMode.light()
  } else if (newTheme === 'system') {
    const isDarkMode = await ipc.client.themeMode.system()
    resolvedTheme = isDarkMode ? 'dark' : 'light'
  }

  applyThemeClass(resolvedTheme)
  localStorage.setItem(THEME_KEY, newTheme)
}

export async function toggleTheme() {
  const isDarkMode = await ipc.client.themeMode.toggle()
  const newTheme = isDarkMode ? 'dark' : 'light'

  applyThemeClass(newTheme)
  localStorage.setItem(THEME_KEY, newTheme)
}

export async function syncThemeWithLocal() {
  const { local } = await getCurrentTheme()
  await setTheme(local ?? 'system')
}

const RESOLVED_THEME_KEY = 'theme-resolved'

function applyThemeClass(resolvedTheme: AppTheme) {
  const previous = localStorage.getItem(RESOLVED_THEME_KEY)
  const body = document.body

  if (previous) {
    body.classList.remove(previous)
  }

  body.classList.add(resolvedTheme)
  localStorage.setItem(RESOLVED_THEME_KEY, resolvedTheme)
}
