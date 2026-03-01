import { TemplateProps } from '@/domain/entities/rule'

export type AddTemplateDTO = Omit<TemplateProps, 'createdAt' | 'lastUpdated'>

export type UpdateTemplateDTO = Partial<AddTemplateDTO> & {
  id: number
}
