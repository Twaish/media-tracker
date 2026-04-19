import { ipc } from '@/ipc'

export async function getPluginPermissionKeys() {
  return ipc.client.plugins.getPermissionKeys()
}

export async function getPluginManifests() {
  return ipc.client.plugins.getManifests()
}

export async function getPluginManifest(name: string) {
  return ipc.client.plugins.getManifest(name)
}

export async function getPluginEntries() {
  return ipc.client.plugins.getEntries()
}
