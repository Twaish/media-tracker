import { hotkeyManager } from '@/app/hotkeys/hotkeyManager'
import { toggleCommandPalette } from '@/app/commandpalette/actions'

const preventDefault = (callback: () => void) => (e: KeyboardEvent) => {
  e?.preventDefault()
  callback()
}

hotkeyManager.register({
  keys: 'ctrl+k',
  handler: preventDefault(toggleCommandPalette),
})
