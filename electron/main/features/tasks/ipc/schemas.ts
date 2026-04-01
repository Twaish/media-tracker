import z from 'zod'

export const taskSchema = z.object({
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
