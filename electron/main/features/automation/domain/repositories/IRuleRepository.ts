import { AddRuleRepoDTO, UpdateRuleRepoDTO } from '@shared/types/automation'
import { PersistedRule } from '../entities/rule'

export interface IRuleRepository {
  getById(id: number): Promise<PersistedRule>
  add(rule: AddRuleRepoDTO): Promise<PersistedRule>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(rule: UpdateRuleRepoDTO): Promise<PersistedRule>
  getAllEnabled(): Promise<PersistedRule[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedRule>
}
