import { ipc } from '@/ipc'
import { ThemeMode } from '@shared/types'

const THEME_KEY = 'theme'

export interface ThemePreferences {
  system: ThemeMode
  local: ThemeMode | null
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.themeMode.current()
  const localTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null

  return {
    system: currentTheme,
    local: localTheme,
  }
}

export async function setTheme(newTheme: ThemeMode) {
  switch (newTheme) {
    case 'dark':
      await ipc.client.themeMode.dark()
      updateDocumentTheme(true)
      break
    case 'light':
      await ipc.client.themeMode.light()
      updateDocumentTheme(false)
      break
    case 'system': {
      const isDarkMode = await ipc.client.themeMode.system()
      updateDocumentTheme(isDarkMode)
      break
    }
  }

  localStorage.setItem(THEME_KEY, newTheme)
}

export async function toggleTheme() {
  const isDarkMode = await ipc.client.themeMode.toggle()
  const newTheme = isDarkMode ? 'dark' : 'light'

  updateDocumentTheme(isDarkMode)
  localStorage.setItem(THEME_KEY, newTheme)
}

export async function syncThemeWithLocal() {
  const { local } = await getCurrentTheme()
  if (!local) {
    setTheme('system')
    return
  }

  await setTheme(local)
}

function updateDocumentTheme(isDarkMode: boolean) {
  if (!isDarkMode) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
