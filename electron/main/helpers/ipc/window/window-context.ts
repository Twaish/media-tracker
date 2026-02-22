import { WindowContext } from '@shared/types'
import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
  WIN_READY,
} from './window-channels'

export function exposeWindowContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: WindowContext = {
    minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
    maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
    close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    ready: () => ipcRenderer.invoke(WIN_READY),
  }
  contextBridge.exposeInMainWorld('electronWindow', context)
}
