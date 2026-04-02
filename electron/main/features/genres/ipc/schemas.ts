import z from 'zod'

const maxNameMessage = 'Genre name cannot exceed 25 characters'

export const persistedGenreSchema = z.object({
  id: z.number(),
  name: z.string().max(25, maxNameMessage),
  isDeletable: z.boolean(),
})

export const getOutputSchema = z.array(persistedGenreSchema)

export const addInputSchema = z.object({
  name: z.string().max(25, maxNameMessage),
})

export const getByIdInputSchema = z.number()
