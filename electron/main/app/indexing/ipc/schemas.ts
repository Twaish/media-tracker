import z from 'zod'

export const indexSearchResultSchema = z.object({
  title: z.string(),
  index: z.number(),
})

export const indexExtractionSchema = z.object({
  entriesPath: z.string(),
  title: z.string().or(z.array(z.string())),
})

export const indexFileManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  filePath: z.string(),
  source: z.string().optional(),
  version: z.string().optional(),
  importedAt: z.date(),
  lastModified: z.date().optional(),
  enabled: z.boolean(),
  extraction: indexExtractionSchema,
})

export const toggleIndexInputSchema = z.string()
export const toggleIndexOutputSchema = indexFileManifestSchema

export const getAllManifestsOutputSchema = z.array(indexFileManifestSchema)

export const getEntryInputSchema = z.object({
  id: z.string(),
  index: z.number(),
})

export const getManifestInputSchema = z.string()
export const getManifestOutputSchema = indexFileManifestSchema

export const importInputSchema = z.object({
  source: z.string(),
  extraction: indexExtractionSchema,
})
export const importOutputSchema = indexFileManifestSchema

export const isOutdatedInputSchema = z.string()
export const isOutdatedOutputSchema = z.boolean()

export const refreshIndexInputSchema = z.string()
export const refreshIndexOutputSchema = indexFileManifestSchema

export const searchIndexInputSchema = z.object({
  query: z.string(),
  ids: z.array(z.string()).optional(),
})
export const searchIndexOutputSchema = z.record(
  z.string(),
  z.array(indexSearchResultSchema),
)

export const updateExtractionInputSchema = z.object({
  id: z.string(),
  extraction: indexExtractionSchema,
})
export const updateExtractionOutputSchema = indexFileManifestSchema
