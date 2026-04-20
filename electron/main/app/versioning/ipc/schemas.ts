import {
  paginationResultSchema,
  paginationSchema,
} from '@main/helpers/ipc/schemas'
import z from 'zod'
import { DeltaTypes, PersistedDelta } from '../domain/entities/delta'

export const persistedDeltaSchema: z.ZodType<PersistedDelta> = z.object({
  id: z.number(),
  type: z.enum(DeltaTypes),
  entity: z.string(),
  entityId: z.number(),
  before: z.string().optional(),
  after: z.string().optional(),
  createdAt: z.date(),
})

export const getInputSchema = paginationSchema
export const getOutputSchema = paginationResultSchema(persistedDeltaSchema)

export const removeInputSchema = z.array(z.number())
export const removeOutputSchema = z.object({
  deleted: z.number(),
  ids: z.array(z.number()),
})
