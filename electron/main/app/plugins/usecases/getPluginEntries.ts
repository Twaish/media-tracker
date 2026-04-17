import { IPluginManager } from '../application/ports/IPluginManager'

export default class GetPluginEntries {
  constructor(private readonly pluginManager: IPluginManager) {}

  async execute() {
    return this.pluginManager.getAll().map(({ error, ...rest }) => ({
      ...rest,
      error: error ? String(error) : null,
    }))
  }
}
