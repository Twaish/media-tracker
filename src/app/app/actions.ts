import { ipc } from '@/ipc'

export function getAppName() {
  return ipc.client.app.name()
}

export function getAppVersion() {
  return ipc.client.app.version()
}
