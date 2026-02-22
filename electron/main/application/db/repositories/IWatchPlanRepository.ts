import { PersistedWatchPlan } from '@/domain/entities/watchPlan'
import { AddWatchPlanDTO, UpdateWatchPlanDTO } from '@shared/types/watchPlans'

export interface IWatchPlanRepository {
  getById(id: number): Promise<PersistedWatchPlan>
  getAll(): Promise<PersistedWatchPlan[]>
  add(plan: AddWatchPlanDTO): Promise<PersistedWatchPlan>
  update(plan: UpdateWatchPlanDTO): Promise<PersistedWatchPlan>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
}
