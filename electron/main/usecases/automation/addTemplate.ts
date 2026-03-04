import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { RuleEngineCompiler } from '@/domain/automation/RuleEngineCompiler'
import { TemplateNode } from '@/domain/automation/types'
import { AddTemplateDTO } from '@shared/types/automation'

export default class AddTemplate {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: RuleEngineCompiler,
  ) {}

  async execute(template: AddTemplateDTO) {
    const compiled = this.compiler.compile(template.source) as TemplateNode
    return this.repo.add({
      name: compiled.name,
      source: template.source,
      ast: compiled,
    })
  }
}
