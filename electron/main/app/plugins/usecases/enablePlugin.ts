import { IPluginManager } from '../application/ports/IPluginManager'

export default class EnablePlugin {
  constructor(private readonly pluginManager: IPluginManager) {}

  async execute(pluginName: string) {
    return this.pluginManager.enable(pluginName)
  }
}
