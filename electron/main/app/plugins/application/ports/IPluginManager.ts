import { PluginEntry } from '../models/PluginEntry'

export interface IPluginManager {
  load(pluginsPath: string, appVersion: string): Promise<void>
  setup(): Promise<void>
  execute(id: string, ...args: unknown[]): Promise<void>
  destroy(id: string): Promise<void>
  destroyAll(): Promise<void>
  enable(id: string): Promise<void>
  disable(id: string): Promise<void>
  getAll(): PluginEntry[]
}
