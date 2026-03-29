import { IPluginRegistry } from '@/application/ports/plugins/IPluginRegistry'
import { PluginManifest } from '@/application/ports/plugins/PluginManifest'

export class PluginRegistry implements IPluginRegistry {
  private manifests: Map<string, PluginManifest> = new Map()

  register(pluginName: string, manifest: PluginManifest): void {
    if (this.manifests.has(pluginName)) {
      throw new Error(`Plugin "${pluginName}" is already registered`)
    }
    this.manifests.set(pluginName, manifest)
  }

  get(pluginName: string): PluginManifest {
    const manifest = this.manifests.get(pluginName)

    if (manifest == null) {
      throw new Error(`Plugin "${pluginName}" is not registered`)
    }

    return manifest
  }

  getAll(): PluginManifest[] {
    return [...this.manifests.values()]
  }
}
