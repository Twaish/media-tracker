import { PluginManifest } from './PluginManifest'

export type PluginEntry = {
  path: string
  manifest: PluginManifest
  error?: Error
  enabled: boolean
}
