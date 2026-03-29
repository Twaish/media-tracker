import { PluginManifest } from './PluginManifest'

export interface IPluginRegistry {
  register(pluginName: string, manifest: PluginManifest): void
  get(pluginName: string): PluginManifest
  getAll(): PluginManifest[]
}
