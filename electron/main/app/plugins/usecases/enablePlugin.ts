import { IPluginManager } from '../application/ports/IPluginManager'

export default class EnablePlugin {
  constructor(private readonly pluginManager: IPluginManager) {}

  async execute(pluginId: string) {
    return this.pluginManager.enable(pluginId)
  }
}
