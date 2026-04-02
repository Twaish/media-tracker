import { IRuleRepository } from '../domain/repositories/IRuleRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'
import { AddNodeDTO } from '../application/dto/automation.dto'

export default class AddRule {
  constructor(
    private readonly repo: IRuleRepository,
    private readonly compiler: IRuleEngineCompiler,
  ) {}

  async execute(rule: AddNodeDTO) {
    const compiled = this.compiler.compile(rule.source)

    if (compiled.type !== 'rule') {
      throw new Error('Provided source does not compile to a rule')
    }

    return this.repo.add({
      name: compiled.name,
      target: compiled.target,
      trigger: compiled.trigger,
      events: compiled.events,
      priority: compiled.priority,
      enabled: rule.enabled ?? true,
      source: rule.source,
      ast: compiled,
    })
  }
}
