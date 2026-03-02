import {
  PersistedRule,
  PersistedTemplate,
  RuleProps,
} from '@/domain/entities/rule'
import { TemplateProps } from '@/domain/entities/rule'

export type AddRuleDTO = Omit<RuleProps, 'createdAt' | 'lastUpdated'>

export type UpdateRuleDTO = Partial<AddRuleDTO> & {
  id: number
}

export type AddTemplateDTO = Omit<TemplateProps, 'createdAt' | 'lastUpdated'>

export type UpdateTemplateDTO = Partial<AddTemplateDTO> & {
  id: number
}

export interface AutomationContext {
  addRule(rule: AddRuleDTO): Promise<PersistedRule>
  updateRule(rule: UpdateRuleDTO): Promise<PersistedRule>
  removeRules(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  getEnabledRules(): Promise<PersistedRule[]>

  addTemplate(template: AddTemplateDTO): Promise<PersistedTemplate>
  updateTemplate(template: UpdateTemplateDTO): Promise<PersistedTemplate>
  removeTemplates(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  getAllTemplates(): Promise<PersistedTemplate[]>
}
