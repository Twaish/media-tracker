import { IPluginRegistry } from '../application/ports/IPluginRegistry'

export default class GetPluginManifests {
  constructor(private readonly pluginRegistry: IPluginRegistry) {}

  async execute() {
    return this.pluginRegistry.getAll()
  }
}
