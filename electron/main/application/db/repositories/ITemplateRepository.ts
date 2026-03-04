import { PersistedTemplate } from '@/domain/entities/rule'
import {
  AddTemplateRepoDTO,
  UpdateTemplateRepoDTO,
} from '@shared/types/automation'

export interface ITemplateRepository {
  getById(id: number): Promise<PersistedTemplate>
  add(template: AddTemplateRepoDTO): Promise<PersistedTemplate>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(template: UpdateTemplateRepoDTO): Promise<PersistedTemplate>
  getAll(): Promise<PersistedTemplate[]>
}
