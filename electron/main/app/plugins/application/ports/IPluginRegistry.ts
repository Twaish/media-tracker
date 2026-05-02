import { PluginManifest } from '../models/PluginManifest'

export interface IPluginRegistry {
  register(id: string, manifest: PluginManifest): void
  get(id: string): PluginManifest
  getAll(): PluginManifest[]
}
