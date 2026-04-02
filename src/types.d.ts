import { ipc } from './helpers/ipc'

declare global {
  interface Window {
    ipc: typeof ipc
  }
}
