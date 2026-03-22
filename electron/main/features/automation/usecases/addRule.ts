import { AddRuleDTO } from '@shared/types/automation'
import { RuleNode } from '../domain/ast/RuleNode'
import { IRuleRepository } from '../domain/repositories/IRuleRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'

export default class AddRule {
  constructor(
    private readonly repo: IRuleRepository,
    private readonly compiler: IRuleEngineCompiler,
  ) {}

  async execute(rule: AddRuleDTO) {
    const compiled = this.compiler.compile(rule.source) as RuleNode
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
