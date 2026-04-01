import z from 'zod'

import { StoreImageDTO } from '../application/dto/storeImage.dto'
import { StoredImageResultDTO } from '../application/dto/storedImageResult.dto'

export const storeImageInputSchema: z.ZodType<StoreImageDTO> = z.object({
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
export const storedImageResultSchema: z.ZodType<StoredImageResultDTO> =
  z.object({
    hash: z.string(),
    filename: z.string(),
    fullPath: z.string(),
    relativePath: z.string(),
    width: z.number(),
    height: z.number(),
    size: z.number(),
  })
