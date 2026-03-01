import { PersistedTemplate } from '@/domain/entities/rule'
import { AddTemplateDTO, UpdateTemplateDTO } from '@shared/types/template'

export interface ITemplateRepository {
  getById(id: number): Promise<PersistedTemplate>
  add(template: AddTemplateDTO): Promise<PersistedTemplate>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(template: UpdateTemplateDTO): Promise<PersistedTemplate>
}
