import { ipcMain } from 'electron'
import { IpcHandlers } from './types'

/**
 * Registers IPC handlers with their corresponding channel
 *
 * @param handlers The object containing handlers
 */
export function registerIpcHandlers<T>(handlers: IpcHandlers<T>) {
  for (const key in handlers) {
    const [channel, handler] = handlers[key]
    ipcMain.handle(channel, handler)
  }
}
