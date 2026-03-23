import { AddTemplateDTO } from '@shared/types'
import { TemplateNode } from '../domain/ast/TemplateNode'
import { ITemplateRepository } from '../domain/repositories/ITemplateRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'

export default class AddTemplate {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: IRuleEngineCompiler,
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
