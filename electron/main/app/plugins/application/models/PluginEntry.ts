import { PluginManifest } from './PluginManifest'

export const PLUGIN_STATES = [
  'unloaded',
  'loaded', // manifest + module imported
  'setting-up',
  'running', // setup() completed
  'error', // failed at any stage
  'destroyed',
] as const

export type PluginState = (typeof PLUGIN_STATES)[number]

export type PluginEntry = {
  path: string
  manifest: PluginManifest
  state: PluginState
  error?: Error
}
