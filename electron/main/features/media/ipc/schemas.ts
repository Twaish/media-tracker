import z from 'zod'
import {
  MEDIA_STATUS,
  MEDIA_TYPES,
  PersistedMedia,
} from '../domain/entities/media'
import { persistedGenreSchema } from '@/features/genres/ipc/schemas'
import { PersistedMediaProgress } from '../domain/entities/mediaProgress'
import { PersistedMediaEmbedding } from '../domain/entities/mediaEmbedding'

export const mediaSchema = z.object({
  id: z.number(),
  title: z.string(),
  currentEpisode: z.number(),
  maxEpisodes: z.number().nullish(),
  thumbnail: z.string().nullish(),
  type: z.enum(MEDIA_TYPES),
  status: z.enum(MEDIA_STATUS),
  externalLink: z.string().nullish(),
  alternateTitles: z.string().nullish(),
  watchAfter: z.number().nullish(),
  lastUpdated: z.date().nullish(),
  createdAt: z.date().nullish(),
  isFavorite: z.boolean().default(false),
  genres: z.array(persistedGenreSchema),
  deletedAt: z.date().nullish(),
})
type _AssertMediaSchema =
  z.infer<typeof mediaSchema> extends PersistedMedia ? true : never
const _assert: _AssertMediaSchema = true

export const persistedMediaEmbeddingSchema: z.ZodType<PersistedMediaEmbedding> =
  z.object({
    id: z.number(),
    mediaId: z.number(),
    embedding: z.array(z.number()),
    model: z.string(),
  })

export const persistedMediaProgress: z.ZodType<PersistedMediaProgress> =
  z.object({
    id: z.number(),
    mediaId: z.number(),
    progress: z.number(),
    previousProgress: z.number().nullish(),
    createdAt: z.date().optional(),
  })

export const addMediaInputSchema = mediaSchema
  .omit({ id: true, lastUpdated: true, createdAt: true, deletedAt: true })
  .extend({ genres: z.array(z.number()) })

export const removeMediaInputSchema = z.array(z.number())
export const removeMediaOutputSchema = z.object({
  deleted: z.number(),
  ids: z.array(z.number()),
})

export const updateMediaInputSchema = mediaSchema
  .omit({ lastUpdated: true, createdAt: true, deletedAt: true })
  .extend({ genres: z.array(z.number()) })
  .partial()
  .required({ id: true })

export const setNextMediaInputSchema = z.object({
  mediaId: z.number(),
  nextMediaId: z.number(),
})

export const resolveExternalLinkInputSchema = z.number()
export const resolveExternalLinkOutputSchema = z.string().nullable()

export const searchInputSchema = z.string()

export const getByIdInputSchema = z.number()

export const bulkUpdateInputSchema = z.object({
  ids: z.array(z.number()),
  update: updateMediaInputSchema
    .omit({ id: true, genres: true })
    .partial()
    .optional(),
  add: z.object({ genres: z.array(z.number()).optional() }).optional(),
  remove: z.object({ genres: z.array(z.number()).optional() }).optional(),
})
export const bulkUpdateOutputSchema = z.object({
  affected: z.number(),
})

export const findDuplicatesInputSchema = addMediaInputSchema.partial()
export const findDuplicatesOutputSchema = z.array(mediaSchema)

export const createEmbeddingInputSchema = z.object({
  mediaId: z.number(),
  model: z.string(),
})
export const createEmbeddingOutputSchema = persistedMediaEmbeddingSchema

export const searchEmbeddingsInputSchema = z.object({
  query: z.string(),
  model: z.string(),
})
export const searchEmbeddingsOutputSchema = z.array(
  z.object({
    item: z.number(),
    score: z.number(),
  }),
)

export const getMediaMissingEmbeddingsInputSchema = z.object({
  model: z.string(),
})
export const getMediaMissingEmbeddingsOutputSchema = z.array(z.number())

export const fetchFromUrlInputSchema = z.object({
  url: z.string(),
  model: z.string(),
})
export const fetchFromUrlOutputSchema = addMediaInputSchema

export const getProgressHistoryInputSchema = z.number()
export const getProgressHistoryOutputSchema = z.array(persistedMediaProgress)
