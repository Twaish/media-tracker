import { PluginEntry } from '../models/PluginEntry'

export interface IPluginManager {
  load(pluginsPath: string, appVersion: string): Promise<void>
  setup(): Promise<void>
  execute(pluginName: string, ...args: unknown[]): Promise<void>
  destroy(pluginName: string): Promise<void>
  destroyAll(): Promise<void>
  enable(pluginName: string): Promise<void>
  disable(pluginName: string): Promise<void>
  getAll(): PluginEntry[]
}
