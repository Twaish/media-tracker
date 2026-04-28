export type HotkeyHandler = (e: KeyboardEvent) => void

export type Hotkey = {
  keys: string
  handler: HotkeyHandler
  contexts?: string[]
}

export type ParsedHotkey = {
  key: string
  ctrl: boolean
  meta: boolean
  shift: boolean
  alt: boolean
}

export type RegisteredHotkey = Hotkey & {
  id: string
  parsed: ParsedHotkey
}
