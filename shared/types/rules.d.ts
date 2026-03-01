import { RuleProps } from '@/domain/entities/rule'

export type AddRuleDTO = Omit<RuleProps, 'createdAt' | 'lastUpdated'>

export type UpdateRuleDTO = Partial<AddRuleDTO> & {
  id: number
}
