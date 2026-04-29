import { hotkeyManager } from '@/app/hotkeys/hotkeyManager'
import { commands } from './commands'

commands.forEach((item) => {
  if (!item.hotkey || !item.action) return

  hotkeyManager.register({
    keys: item.hotkey,
    handler: (_) => item.action?.(),
  })
})
