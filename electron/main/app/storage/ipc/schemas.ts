import z from 'zod'

export const storeImageInputSchema = z.object({
  imagePath: z.string(),
  options: z
    .object({
      maxWidth: z.number().optional(),
      maxHeight: z.number().optional(),
      format: z.enum(['webp', 'png', 'jpeg']).optional(),
      quality: z.number().optional(),
    })
    .optional(),
})
export const exportImagesInputSchema = z.string()
export const storedImageResultSchema = z.object({
  hash: z.string(),
  filename: z.string(),
  fullPath: z.string(),
  relativePath: z.string(),
  width: z.number(),
  height: z.number(),
  size: z.number(),
})
