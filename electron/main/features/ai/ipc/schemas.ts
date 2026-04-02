import z from 'zod'

const AiCompatibilityResultSuccessSchema = z.object({
  available: z.literal(true),
  version: z.string(),
  models: z.array(z.string()),
})

const AiCompatibilityResultFailureSchema = z.object({
  available: z.literal(false),
  error: z.string(),
})

export const AiCompatibilityResultDTOSchema = z.discriminatedUnion(
  'available',
  [AiCompatibilityResultSuccessSchema, AiCompatibilityResultFailureSchema],
)

export const updateHostInputSchema = z.string()

export const updateApiKeyInputSchema = z.string()

export const getSettingsOutputSchema = z.object({
  host: z.string(),
  apiKey: z.string().optional(),
})

export const createEmbeddingInputSchema = z.object({
  text: z.string(),
  model: z.string().optional(),
})
export const createEmbeddingOutputSchema = z.array(z.number())

export const getCapabilitiesInputSchema = z.string()
export const getCapabilitiesOutputSchema = z.array(z.string())
