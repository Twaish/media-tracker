import { SettingsInterface } from '@/app/settings/application/ports/ISettingsBuilder'

export type BasePluginContext = {
  pluginName: string
  pluginDir: string
  settings?: SettingsInterface
}

export type PluginContext<TExtensions = object> = BasePluginContext &
  TExtensions
