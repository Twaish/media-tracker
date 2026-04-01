import z from 'zod'

export const paginationResultSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
      totalItems: z.number(),
    }),
  })
