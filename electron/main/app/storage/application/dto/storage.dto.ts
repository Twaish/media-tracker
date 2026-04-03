import z from 'zod'
import {
  storedImageResultSchema,
  storeImageInputSchema,
} from '../../ipc/schemas'

export type StoreImageDTO = z.infer<typeof storeImageInputSchema>
export type StoredImageResultDTO = z.infer<typeof storedImageResultSchema>
