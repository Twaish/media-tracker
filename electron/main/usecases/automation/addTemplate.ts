import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { AddTemplateDTO } from '@shared/types/automation'

export default class AddTemplate {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(template: AddTemplateDTO) {
    return this.repo.add(template)
  }
}
