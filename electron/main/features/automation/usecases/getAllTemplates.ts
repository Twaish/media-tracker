import { ITemplateRepository } from '../domain/repositories/ITemplateRepository'

export default class GetAllTemplates {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute() {
    return this.repo.getAll()
  }
}
