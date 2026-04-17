import z from 'zod'
import { PluginManifest } from '../application/models/PluginManifest'
import { PLUGIN_STATES } from '../application/models/PluginEntry'

export const pluginManifestSchema: z.ZodType<PluginManifest> = z.object({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  author: z.string().optional(),
  icon: z.string().optional(),
  repository: z.string().optional(),
  minAppVersion: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
})

export const pluginEntrySchema = z.object({
  path: z.string(),
  manifest: pluginManifestSchema,
  state: z.enum(PLUGIN_STATES),
  error: z.string().nullish(),
})

export const getPermissionKeysOutputSchema = z.array(z.string())

export const getManifestsOutputSchema = z.array(pluginManifestSchema)

export const getManifestInputSchema = z.string()
export const getManifestOutputSchema = pluginManifestSchema

export const getEntriesOutputSchema = z.array(pluginEntrySchema)
