import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { UpdateTemplateDTO } from '@shared/types/automation'

export default class UpdateTemplate {
  constructor(private readonly repo: ITemplateRepository) {}

  async execute(template: UpdateTemplateDTO) {
    return this.repo.update(template)
  }
}
