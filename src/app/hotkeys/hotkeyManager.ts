import { Hotkey, ParsedHotkey, RegisteredHotkey } from './types'
import { v4 } from 'uuid'

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
      const { contexts = [], parsed, handler } = hotkey
      const isActive =
        contexts.length === 0 ||
        contexts.some((ctx) => this.activeContexts.has(ctx))

      if (isActive && matches(parsed, e)) {
        handler(e)
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

  create(hotkey: Hotkey): RegisteredHotkey {
    return {
      id: v4(),
      ...hotkey,
      parsed: parse(hotkey.keys),
    }
  }

  register(hotkey: Hotkey): () => void
  register(hotkey: RegisteredHotkey): () => void
  register(hotkey: Hotkey | RegisteredHotkey) {
    let fullHotkey: RegisteredHotkey

    if (this.hasId(hotkey)) {
      fullHotkey = hotkey
    } else {
      fullHotkey = this.create(hotkey)
    }

    this.hotkeys.set(fullHotkey.id, fullHotkey)

    return () => this.unregister(fullHotkey.id)
  }

  private hasId(hotkey: Hotkey | RegisteredHotkey): hotkey is RegisteredHotkey {
    return 'id' in hotkey
  }

  get(id: string) {
    return this.hotkeys.get(id)
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
