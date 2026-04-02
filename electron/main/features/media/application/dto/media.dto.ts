import z from 'zod'
import { Pagination } from '@shared/types'
import { Filter } from '../../domain/query/Filter'
import {
  addMediaInputSchema,
  bulkUpdateInputSchema,
  updateMediaInputSchema,
} from '../../ipc/schemas'

export type AddMediaDTO = z.infer<typeof addMediaInputSchema>
export type UpdateMediaDTO = z.infer<typeof updateMediaInputSchema>
export type BulkUpdateMediaDTO = z.infer<typeof bulkUpdateInputSchema>

export type MediaSearchOptions = {
  title?: string
  filters?: Filter[]
  pagination?: Pagination
}
