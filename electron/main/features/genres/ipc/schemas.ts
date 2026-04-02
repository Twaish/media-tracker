import z from 'zod'
import { PersistedGenre } from '../domain/entities/genre'

const maxNameMessage = 'Genre name cannot exceed 25 characters'

export const persistedGenreSchema: z.ZodType<PersistedGenre> = z.object({
  id: z.number(),
  name: z.string().max(25, maxNameMessage),
  isDeletable: z.boolean(),
})

export const getOutputSchema = z.array(persistedGenreSchema)

export const addInputSchema = z.object({
  name: z.string().max(25, maxNameMessage),
})

export const getByIdInputSchema = z.number()
