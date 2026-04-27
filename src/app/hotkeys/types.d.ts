export type HotkeyHandler = (e: KeyboardEvent) => void

export type Hotkey = {
  id: string
  keys: string
  handler: HotkeyHandler
  contexts: string[]
}

export type ParsedHotkey = {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  alt: boolean
}
