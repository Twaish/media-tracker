import z from 'zod'
import { addNodeInputSchema, updateNodeInputSchema } from '../../ipc/schemas'

export type AddNodeDTO = z.infer<typeof addNodeInputSchema>
export type UpdateNodeDTO = z.infer<typeof updateNodeInputSchema>
