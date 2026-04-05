import { PluginContext } from './PluginContext'

export type PluginModule = {
  settings: Record<string, unknown>
  setup?(context: PluginContext): Promise<void> | void
  execute?(context: PluginContext, ...args: unknown[]): Promise<void> | void
  destroy?(context: PluginContext): Promise<void> | void
}
