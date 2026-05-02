import { IPluginRegistry } from '../application/ports/IPluginRegistry'

export default class GetPluginManifest {
  constructor(private readonly pluginRegistry: IPluginRegistry) {}

  async execute(pluginId: string) {
    return this.pluginRegistry.get(pluginId)
  }
}
