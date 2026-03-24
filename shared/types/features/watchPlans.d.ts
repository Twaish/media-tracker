import { PersistedWatchPlan } from '@/features/watchplan/domain/entities/watchPlan'

export type {
  AddWatchPlanDTO,
  UpdateWatchPlanDTO,
} from '@/features/watchplan/application/dto/watchPlan.dto'

import type {
  AddWatchPlanDTO,
  UpdateWatchPlanDTO,
} from '@/features/watchplan/application/dto/watchPlan.dto'

export interface WatchPlansContext {
  get(): Promise<PersistedWatchPlan[]>
  add(watchPlan: AddWatchPlanDTO): Promise<PersistedWatchPlan>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(media: UpdateWatchPlanDTO): Promise<PersistedWatchPlan>
}
