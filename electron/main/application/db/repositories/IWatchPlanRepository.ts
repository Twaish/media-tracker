import { PersistedWatchPlan, WatchPlan } from '@/domain/entities/watchPlan'
import {
  WatchPlanCreateInput,
  WatchPlanUpdateInput,
} from '@shared/types/watchPlans'

export interface IWatchPlanRepository {
  getById(id: number): Promise<PersistedWatchPlan>
  getAll(): Promise<PersistedWatchPlan[]>
  add(plan: WatchPlanCreateInput): Promise<PersistedWatchPlan>
  update(plan: WatchPlanUpdateInput): Promise<PersistedWatchPlan>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
}
