import { ipcMain } from 'electron'
import {
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL,
  WIN_READY,
} from './window-channels'
import { Modules } from '../types'

export function addWindowEventListeners({ ElectronWindow, window }: Modules) {
  ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
    window.minimize()
  })
  ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
    window.close()
  })
  ipcMain.handle(WIN_READY, () => {
    ElectronWindow.ready()
  })
}
