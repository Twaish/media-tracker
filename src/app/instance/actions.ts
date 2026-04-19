import { ipc } from '@/ipc'

export function getAppName() {
  return ipc.client.instance.name()
}

export function getAppVersion() {
  return ipc.client.instance.version()
}
