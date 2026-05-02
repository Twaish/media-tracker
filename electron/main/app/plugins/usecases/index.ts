import { Modules } from '@/helpers/ipc/types'
import GetPluginPermissionKeys from './getPluginPermissionKeys'
import GetPluginManifests from './getPluginManifests'
import GetPluginManifest from './getPluginManifest'
import GetPluginEntries from './getPluginEntries'
import DisablePlugin from './disablePlugin'
import EnablePlugin from './enablePlugin'

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
    disablePlugin: new DisablePlugin(PluginManager),
    enablePlugin: new EnablePlugin(PluginManager),
  }
}
