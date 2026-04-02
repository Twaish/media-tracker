import z from 'zod'

export const paginationSchema = z
  .object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
  })
  .optional()

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
