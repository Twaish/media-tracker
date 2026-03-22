import {
  PersistedRule,
  RuleProps,
} from '@/features/automation/domain/entities/rule'
import {
  PersistedTemplate,
  TemplateProps,
} from '@/features/automation/domain/entities/template'

export type AddRuleDTO = {
  source: string
  enabled?: boolean
}
export type UpdateRuleDTO = Partial<AddRuleDTO> & {
  id: number
}

export type AddRuleRepoDTO = Omit<RuleProps, 'createdAt' | 'lastUpdated'>
export type UpdateRuleRepoDTO = Partial<AddRuleRepoDTO> & {
  id: number
}

export type AddTemplateDTO = {
  source: string
}
export type UpdateTemplateDTO = Partial<AddTemplateDTO> & {
  id: number
}

export type AddTemplateRepoDTO = Omit<
  TemplateProps,
  'createdAt' | 'lastUpdated'
>
export type UpdateTemplateRepoDTO = Partial<AddTemplateRepoDTO> & {
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
