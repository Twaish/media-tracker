import { Hotkey, ParsedHotkey } from './types'

const isMac = navigator.platform.toUpperCase().includes('MAC')

const parse = (keys: string): ParsedHotkey => {
  const parts = keys
    .toLowerCase()
    .replace('mod', isMac ? 'meta' : 'ctrl')
    .split('+')

  return {
    key: parts.at(-1)!,
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  }
}

const matches = (parsed: ParsedHotkey, e: KeyboardEvent): boolean =>
  e.key.toLowerCase() === parsed.key &&
  e.ctrlKey === parsed.ctrl &&
  e.metaKey === parsed.meta &&
  e.shiftKey === parsed.shift &&
  e.altKey === parsed.alt

class HotkeyManager {
  private hotkeys = new Map<string, Hotkey & { parsed: ParsedHotkey }>()
  private activeContexts = new Set<string>()
  private listening = false

  private globalHandler = (e: KeyboardEvent) => {
    for (const hotkey of this.hotkeys.values()) {
      const isActive =
        hotkey.contexts.length === 0 ||
        hotkey.contexts.some((ctx) => this.activeContexts.has(ctx))

      if (isActive && matches(hotkey.parsed, e)) {
        hotkey.handler(e)
      }
    }
  }

  init() {
    if (this.listening) return
    window.addEventListener('keydown', this.globalHandler)
    this.listening = true
    return () => this.destroy()
  }

  destroy() {
    window.removeEventListener('keydown', this.globalHandler)
    this.listening = false
  }

  register(hotkey: Hotkey) {
    this.hotkeys.set(hotkey.id, { ...hotkey, parsed: parse(hotkey.keys) })
    return () => this.unregister(hotkey.id)
  }

  unregister(id: string) {
    this.hotkeys.delete(id)
  }

  pushContext(context: string) {
    this.activeContexts.add(context)
  }

  popContext(context: string) {
    this.activeContexts.delete(context)
  }

  getActiveContexts() {
    return new Set(this.activeContexts)
  }
}

export const hotkeyManager = new HotkeyManager()
