import { ipc } from './ipc'

declare global {
  interface Window {
    ipc: typeof ipc
  }
}
