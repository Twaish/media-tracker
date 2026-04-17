import { PluginManifest } from './PluginManifest'

export type PluginState =
  | 'unloaded'
  | 'loaded' // manifest + module imported
  | 'setting-up'
  | 'running' // setup() completed
  | 'error' // failed at any stage
  | 'destroyed'

export type PluginEntry = {
  path: string
  manifest: PluginManifest
  state: PluginState
  error?: Error
}
