import { IPluginManager } from '../application/ports/IPluginManager'

export default class DisablePlugin {
  constructor(private readonly pluginManager: IPluginManager) {}

  async execute(pluginId: string) {
    return this.pluginManager.disable(pluginId)
  }
}
