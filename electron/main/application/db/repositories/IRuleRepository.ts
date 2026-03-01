import { PersistedRule } from '@/domain/entities/rule'
import { AddRuleDTO, UpdateRuleDTO } from '@shared/types/automation'

export interface IRuleRepository {
  getById(id: number): Promise<PersistedRule>
  add(rule: AddRuleDTO): Promise<PersistedRule>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(rule: UpdateRuleDTO): Promise<PersistedRule>
  getAllEnabled(): Promise<PersistedRule[]>
}
