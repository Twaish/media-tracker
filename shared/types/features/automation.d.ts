export type AddNodeDTO = {
  source: string
  enabled?: boolean
}
export type UpdateNodeDTO = Partial<AddNodeDTO> & {
  id: number
}

export type {
  AddRuleRepoDTO,
  UpdateRuleRepoDTO,
  AddTemplateRepoDTO,
  UpdateTemplateRepoDTO,
} from '@/features/automation/application/dto/automation.dto'
