import { SettingsInterface } from '@/app/settings/application/ports/ISettingsBuilder'
import { Modules } from '@/helpers/ipc/types'

// TODO: Add permissions
// TODO: Add plugin context containing settings, plugindir, etc.
export type PluginModule = {
  getSettings(): Promise<Record<string, unknown>>
  setup?(
    modules: Modules,
    pluginDir: string,
    settings?: SettingsInterface,
  ): Promise<void> | void
  execute?(modules: Modules, ...args: unknown[]): Promise<void> | void
  destroy?(modules: Modules): Promise<void> | void
}
