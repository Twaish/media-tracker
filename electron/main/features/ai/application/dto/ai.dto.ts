import z from 'zod'
import { aiCompatibilityResultSchema } from '../../ipc/schemas'

export type AiCompatibilityResultDTO = z.infer<
  typeof aiCompatibilityResultSchema
>
