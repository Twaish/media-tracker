import { themeModes } from '@shared/constants'
import z from 'zod'

export const themeSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
})

export const themeDefinitionSchema = themeSummarySchema.extend({
  colors: z.record(z.string(), z.string()),
})

export const getThemesOutputSchema = z.array(themeSummarySchema)

export const getThemeInputSchema = z.string()

export const currentOutputSchema = z.enum(themeModes)

export const toggleOutputSchema = z.boolean()

export const getSystemThemeOutputSchema = z.enum(themeModes)

export const systemOutputSchema = z.boolean()
