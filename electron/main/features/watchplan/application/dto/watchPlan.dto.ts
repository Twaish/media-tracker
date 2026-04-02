import z from 'zod'
import {
  addWatchPlanInputSchema,
  updateWatchPlanInputSchema,
} from '../../ipc/schemas'

export type AddWatchPlanDTO = z.infer<typeof addWatchPlanInputSchema>
export type UpdateWatchPlanDTO = z.infer<typeof updateWatchPlanInputSchema>
