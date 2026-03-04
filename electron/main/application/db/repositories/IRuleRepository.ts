import { PersistedRule } from '@/domain/entities/rule'
import { AddRuleRepoDTO, UpdateRuleRepoDTO } from '@shared/types/automation'

export interface IRuleRepository {
  getById(id: number): Promise<PersistedRule>
  add(rule: AddRuleRepoDTO): Promise<PersistedRule>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(rule: UpdateRuleRepoDTO): Promise<PersistedRule>
  getAllEnabled(): Promise<PersistedRule[]>
}
