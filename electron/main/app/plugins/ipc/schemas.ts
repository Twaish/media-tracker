import z from 'zod'
import { PluginManifest } from '../application/models/PluginManifest'

export const pluginManifestSchema: z.ZodType<PluginManifest> = z.object({
  id: z.string(),
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
  error: z.string().nullish(),
  enabled: z.boolean(),
})

export const getPermissionKeysOutputSchema = z.array(z.string())

export const getManifestsOutputSchema = z.array(pluginManifestSchema)

export const getManifestInputSchema = z.string()
export const getManifestOutputSchema = pluginManifestSchema

export const getEntriesOutputSchema = z.array(pluginEntrySchema)

export const disablePluginInputSchema = z.string()

export const enablePluginInputSchema = z.string()
