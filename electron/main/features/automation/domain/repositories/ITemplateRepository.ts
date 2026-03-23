import {
  AddTemplateRepoDTO,
  UpdateTemplateRepoDTO,
} from '../../application/dto/automationDto'
import { PersistedTemplate } from '../entities/template'

export interface ITemplateRepository {
  getById(id: number): Promise<PersistedTemplate>
  add(template: AddTemplateRepoDTO): Promise<PersistedTemplate>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(template: UpdateTemplateRepoDTO): Promise<PersistedTemplate>
  getAll(): Promise<PersistedTemplate[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedTemplate>
}
