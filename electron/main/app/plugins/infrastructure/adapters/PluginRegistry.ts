import { IPluginRegistry } from '../../application/ports/IPluginRegistry'
import { PluginManifest } from '../../application/models/PluginManifest'

export class PluginRegistry implements IPluginRegistry {
  private manifests: Map<string, PluginManifest> = new Map()

  register(id: string, manifest: PluginManifest): void {
    if (this.manifests.has(id)) {
      throw new Error(`Plugin "${id}" is already registered`)
    }
    this.manifests.set(id, manifest)
  }

  get(id: string): PluginManifest {
    const manifest = this.manifests.get(id)

    if (manifest == null) {
      throw new Error(`Plugin "${id}" is not registered`)
    }

    return manifest
  }

  getAll(): PluginManifest[] {
    return [...this.manifests.values()]
  }
}
