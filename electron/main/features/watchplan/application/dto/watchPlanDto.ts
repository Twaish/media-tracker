import { WatchPlanProps } from '../../domain/entities/watchPlan'

export type AddWatchPlanDTO = Omit<WatchPlanProps, 'createdAt'>

export type UpdateWatchPlanDTO = Partial<AddWatchPlanDTO> & {
  id: number
}
