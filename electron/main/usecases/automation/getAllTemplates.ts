import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'

export default class GetAllTemplates {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute() {
    return this.repo.getAll()
  }
}
