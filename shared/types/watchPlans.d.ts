import { PersistedWatchPlan, WatchPlanProps } from '@/domain/entities/watchPlan'

export type AddWatchPlanDTO = Omit<WatchPlanProps, 'createdAt'>

export type UpdateWatchPlanDTO = Partial<AddWatchPlanDTO> & {
  id: number
}

export interface WatchPlansContext {
  get(): Promise<PersistedWatchPlan[]>
  add(watchPlan: AddWatchPlanDTO): Promise<PersistedWatchPlan>
  remove(ids: number[]): Promise<void>
  update(media: UpdateWatchPlanDTO): Promise<PersistedWatchPlan>
}
