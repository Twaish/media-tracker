import { RuleProps } from '../../domain/entities/rule'
import { TemplateProps } from '../../domain/entities/template'

export type AddRuleRepoDTO = Omit<RuleProps, 'createdAt' | 'lastUpdated'>
export type UpdateRuleRepoDTO = Partial<AddRuleRepoDTO> & {
  id: number
}

export type AddTemplateRepoDTO = Omit<
  TemplateProps,
  'createdAt' | 'lastUpdated'
>
export type UpdateTemplateRepoDTO = Partial<AddTemplateRepoDTO> & {
  id: number
}
