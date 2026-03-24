import { PersistedRule } from '@/features/automation/domain/entities/rule'
import { PersistedTemplate } from '@/features/automation/domain/entities/template'

export type AddRuleDTO = {
  source: string
  enabled?: boolean
}
export type UpdateRuleDTO = Partial<AddRuleDTO> & {
  id: number
}

export type {
  AddRuleRepoDTO,
  UpdateRuleRepoDTO,
  AddTemplateRepoDTO,
  UpdateTemplateRepoDTO,
} from '@/features/automation/application/dto/automation.dto'

export type AddTemplateDTO = {
  source: string
}
export type UpdateTemplateDTO = Partial<AddTemplateDTO> & {
  id: number
}

export interface AutomationContext {
  syncEngine(): Promise<void>

  addRule(rule: AddRuleDTO): Promise<PersistedRule>
  updateRule(rule: UpdateRuleDTO): Promise<PersistedRule>
  removeRules(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  getEnabledRules(): Promise<PersistedRule[]>

  addTemplate(template: AddTemplateDTO): Promise<PersistedTemplate>
  updateTemplate(template: UpdateTemplateDTO): Promise<PersistedTemplate>
  removeTemplates(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  getAllTemplates(): Promise<PersistedTemplate[]>
}
