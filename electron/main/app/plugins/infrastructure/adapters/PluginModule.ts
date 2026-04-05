import { Schema } from '@/app/settings/application/ports/ISettingsBuilder'
import { PluginContext } from './PluginContext'

export type PluginModule = {
  settings: Schema
  setup?(context: PluginContext): Promise<void> | void
  execute?(context: PluginContext, ...args: unknown[]): Promise<void> | void
  destroy?(context: PluginContext): Promise<void> | void
}
