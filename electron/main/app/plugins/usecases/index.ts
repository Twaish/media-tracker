import { Modules } from '@/helpers/ipc/types'
import GetPluginPermissionKeys from './getPluginPermissionKeys'
import GetPluginManifests from './getPluginManifests'
import GetPluginManifest from './getPluginManifest'
import GetPluginEntries from './getPluginEntries'

export function createPluginsUseCases({
  PermissionRegistry,
  PluginRegistry,
  PluginManager,
}: Modules) {
  return {
    getPluginPermissions: new GetPluginPermissionKeys(PermissionRegistry),
    getPluginManifests: new GetPluginManifests(PluginRegistry),
    getPluginManifest: new GetPluginManifest(PluginRegistry),
    getPluginEntries: new GetPluginEntries(PluginManager),
  }
}
