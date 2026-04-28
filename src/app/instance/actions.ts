import { ipc } from '@/core/ipc'

export function getAppName() {
  return ipc.client.instance.name()
}

export function getAppVersion() {
  return ipc.client.instance.version()
}
