import z from 'zod'
import { addTaskInputSchema, progressTaskInputSchema } from '../../ipc/schemas'

export type AddTaskDTO = z.infer<typeof addTaskInputSchema>
export type ProgressTaskDTO = z.infer<typeof progressTaskInputSchema>
