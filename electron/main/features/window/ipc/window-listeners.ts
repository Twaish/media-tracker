import {
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL,
  WIN_READY,
} from './window-channels'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'
import { WindowContext } from '@shared/types'

export function addWindowEventListeners({ ElectronWindow, window }: Modules) {
  registerIpcHandlers<WindowContext>({
    minimize: [WIN_MINIMIZE_CHANNEL, () => window.minimize()],
    maximize: [
      WIN_MAXIMIZE_CHANNEL,
      () => {
        if (window.isMaximized()) {
          window.unmaximize()
        } else {
          window.maximize()
        }
      },
    ],
    close: [WIN_CLOSE_CHANNEL, () => window.close()],
    ready: [WIN_READY, () => ElectronWindow.ready()],
  })
}
