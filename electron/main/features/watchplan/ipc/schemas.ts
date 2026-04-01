import z from 'zod'

export const persistedWatchPlanSegmentSchema = z.object({
  mediaId: z.number(),
  startEpisode: z.number(),
  endEpisode: z.number(),
  order: z.number().optional(),
})

export const persistedWatchPlanSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date().nullable(),
  segments: z.array(persistedWatchPlanSegmentSchema),
})

export const watchPlanSegmentSchema = z.object({
  mediaId: z.number(),
  startEpisode: z.number(),
  endEpisode: z.number(),
  order: z.number().optional(),
})

export const getWatchPlansOutputSchema = z.array(persistedWatchPlanSchema)

export const addWatchPlanInputSchema = z.object({
  name: z.string(),
  segments: z.array(watchPlanSegmentSchema),
})

export const updateWatchPlanInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  segments: z.array(watchPlanSegmentSchema).optional(),
})

export const removeWatchPlansInputSchema = z.array(z.number())

export const removeWatchPlansOutputSchema = z.object({
  deleted: z.number(),
  ids: z.array(z.number()),
})
