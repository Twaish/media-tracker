import z from 'zod'
import { Task } from '../application/models/task.model'

export const taskSchema: z.ZodType<Task> = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  progress: z.number(),
})

export const addTaskInputSchema = z.object({
  label: z.string(),
  description: z.string(),
})

export const getTasksOutputSchema = z.record(z.string(), taskSchema)

export const progressTaskInputSchema = z.object({
  id: z.string(),
  progress: z.number(),
  description: z.string(),
})
