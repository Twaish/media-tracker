import { ipc } from '@/core/ipc'

export async function getPluginPermissionKeys() {
  return ipc.client.plugins.getPermissionKeys()
}

export async function getPluginManifests() {
  return ipc.client.plugins.getManifests()
}

export async function getPluginManifest(id: string) {
  return ipc.client.plugins.getManifest(id)
}

export async function getPluginEntries() {
  return ipc.client.plugins.getEntries()
}

export async function disablePlugin(id: string) {
  return ipc.client.plugins.disable(id)
}

export async function enablePlugin(id: string) {
  return ipc.client.plugins.enable(id)
}
