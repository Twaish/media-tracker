import z from 'zod'

export const getOutputSchema = z.array(
  z.object({
    name: z.string(),
    description: z.string(),
  }),
)
