import {
  AddWatchPlanDTO,
  UpdateWatchPlanDTO,
} from '../../application/dto/watchPlan.dto'
import { PersistedWatchPlan } from '../entities/watchPlan'

export interface IWatchPlanRepository {
  getById(id: number): Promise<PersistedWatchPlan>
  getAll(): Promise<PersistedWatchPlan[]>
  add(plan: AddWatchPlanDTO): Promise<PersistedWatchPlan>
  update(plan: UpdateWatchPlanDTO): Promise<PersistedWatchPlan>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  streamAll(batchSize?: number): AsyncIterable<PersistedWatchPlan>
}
