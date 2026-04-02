import { ITemplateRepository } from '../domain/repositories/ITemplateRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'
import { AddNodeDTO } from '../application/dto/automation.dto'

export default class AddTemplate {
  constructor(
    private readonly repo: ITemplateRepository,
    private readonly compiler: IRuleEngineCompiler,
  ) {}

  async execute(template: AddNodeDTO) {
    const compiled = this.compiler.compile(template.source)

    if (compiled.type !== 'template') {
      throw new Error('Provided source does not compile to a template')
    }

    return this.repo.add({
      name: compiled.name,
      source: template.source,
      ast: compiled,
    })
  }
}
