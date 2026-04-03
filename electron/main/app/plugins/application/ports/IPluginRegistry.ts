import { PluginManifest } from '../models/PluginManifest'

export interface IPluginRegistry {
  register(pluginName: string, manifest: PluginManifest): void
  get(pluginName: string): PluginManifest
  getAll(): PluginManifest[]
}
