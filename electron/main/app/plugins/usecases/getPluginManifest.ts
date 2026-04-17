import { IPluginRegistry } from '../application/ports/IPluginRegistry'

export default class GetPluginManifest {
  constructor(private readonly pluginRegistry: IPluginRegistry) {}

  async execute(pluginName: string) {
    return this.pluginRegistry.get(pluginName)
  }
}
