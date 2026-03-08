import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { RuleEngineCompiler } from '@/domain/automation/RuleEngineCompiler'
import { RuleNode } from '@/domain/automation/types'
import { AddRuleDTO } from '@shared/types/automation'

export default class AddRule {
  constructor(
    private readonly repo: IRuleRepository,
    private readonly compiler: RuleEngineCompiler,
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
