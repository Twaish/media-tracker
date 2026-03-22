import {
  UpdateTemplateDTO,
  UpdateTemplateRepoDTO,
} from '@shared/types/automation'

import { TemplateNode } from '../domain/ast/TemplateNode'
import { ITemplateRepository } from '../domain/repositories/ITemplateRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'

export default class UpdateTemplate {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: IRuleEngineCompiler,
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
