export type PluginManifest = {
  name: string
  description?: string
  version?: string
  author?: string
  icon?: string
  repository?: string
  minAppVersion?: string
  dependencies?: string[] // Other plugin names
}
