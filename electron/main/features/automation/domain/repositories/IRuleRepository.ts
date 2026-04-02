import {
  AddRuleParams,
  PersistedRule,
  UpdateRuleParams,
} from '../entities/rule'

export interface IRuleRepository {
  getById(id: number): Promise<PersistedRule>
  add(rule: AddRuleParams): Promise<PersistedRule>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(rule: UpdateRuleParams): Promise<PersistedRule>
  getAll(): Promise<PersistedRule[]>
  getAllEnabled(): Promise<PersistedRule[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedRule>
}
