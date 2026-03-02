import { ipcMain } from 'electron'
import { IpcHandlers } from './types'

export function registerIpcHandlers<T>(handlers: IpcHandlers<T>) {
  for (const key in handlers) {
    const [channel, handler] = handlers[key]
    ipcMain.handle(channel, handler)
  }
}
