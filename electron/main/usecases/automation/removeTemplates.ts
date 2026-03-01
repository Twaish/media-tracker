import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'

export default class RemoveTemplates {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(ids: number[]) {
    return this.repo.remove(ids)
  }
}
