import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { RuleEngineCompiler } from '@/domain/automation/RuleEngineCompiler'
import { TemplateNode } from '@/domain/automation/types'
import {
  UpdateTemplateDTO,
  UpdateTemplateRepoDTO,
} from '@shared/types/automation'

export default class UpdateTemplate {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: RuleEngineCompiler,
  ) {}

  async execute(template: UpdateTemplateDTO) {
    let templateChanges: UpdateTemplateRepoDTO = { id: template.id }
    if (template.source) {
      const compiled = this.compiler.compile(template.source) as TemplateNode
      templateChanges = {
        ...templateChanges,
        name: compiled.name,
        source: template.source,
        ast: compiled,
      }
    }
    return this.repo.update(templateChanges)
  }
}
