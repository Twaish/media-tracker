import { ipc } from '@/core/ipc'

export function getAppName() {
  return ipc.client.instance.name()
}

export function getAppVersion() {
  return ipc.client.instance.version()
}

export function openFolder(path: string) {
  return ipc.client.instance.openFolder(path)
}

export function openLink(link: string) {
  return ipc.client.instance.openLink(link)
}
