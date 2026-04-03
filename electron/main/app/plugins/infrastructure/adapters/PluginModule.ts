import { Modules } from '@/helpers/ipc/types'

// TODO: Add permissions
export type PluginModule = {
  setup?(modules: Modules, pluginDir: string): Promise<void> | void
  execute?(modules: Modules, ...args: unknown[]): Promise<void> | void
  destroy?(modules: Modules): Promise<void> | void
}
