export interface IPluginManager {
  load(pluginsPath: string, appVersion: string): Promise<void>
  setup(): Promise<void>
  execute(pluginName: string, ...args: unknown[]): Promise<void>
  destroy(pluginName: string): Promise<void>
  destroyAll(): Promise<void>
}
