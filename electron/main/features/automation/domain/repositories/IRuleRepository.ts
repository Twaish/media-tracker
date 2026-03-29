import {
  AddRuleRepoDTO,
  UpdateRuleRepoDTO,
} from '../../application/dto/automation.dto'
import { PersistedRule } from '../entities/rule'

export interface IRuleRepository {
  getById(id: number): Promise<PersistedRule>
  add(rule: AddRuleRepoDTO): Promise<PersistedRule>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(rule: UpdateRuleRepoDTO): Promise<PersistedRule>
  getAll(): Promise<PersistedRule[]>
  getAllEnabled(): Promise<PersistedRule[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedRule>
}
