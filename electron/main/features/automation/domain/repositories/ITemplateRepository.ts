import {
  AddTemplateParams,
  PersistedTemplate,
  UpdateTemplateParams,
} from '../entities/template'

export interface ITemplateRepository {
  getById(id: number): Promise<PersistedTemplate>
  add(template: AddTemplateParams): Promise<PersistedTemplate>
  remove(ids: number[]): Promise<{ deleted: number; ids: number[] }>
  update(template: UpdateTemplateParams): Promise<PersistedTemplate>
  getAll(): Promise<PersistedTemplate[]>
  streamAll(batchSize?: number): AsyncIterable<PersistedTemplate>
}
