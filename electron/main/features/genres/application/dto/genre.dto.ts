import z from 'zod'
import { addInputSchema } from '../../ipc/schemas'

export type AddGenreDTO = z.infer<typeof addInputSchema>
