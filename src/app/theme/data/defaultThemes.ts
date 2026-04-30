import { Theme } from '../actions'

export const systemTheme: Theme = {
  id: 'system',
  name: 'System',
  className: '',
}
export const lightTheme: Theme = {
  id: 'light',
  name: 'Default Light',
  className: 'light',
}
export const darkTheme: Theme = {
  id: 'dark',
  name: 'Default Dark',
  className: 'dark',
}

export const defaultThemes: Theme[] = [systemTheme, lightTheme, darkTheme]
