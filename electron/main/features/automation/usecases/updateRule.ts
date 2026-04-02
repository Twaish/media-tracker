import { UpdateNodeDTO } from '../application/dto/automation.dto'

import { RuleNode } from '../domain/ast/RuleNode'
import { IRuleRepository } from '../domain/repositories/IRuleRepository'
import { IRuleEngineCompiler } from '../application/interfaces/IRuleEngineCompiler'
import { UpdateRuleParams } from '../domain/entities/rule'

export default class UpdateRule {
  constructor(
    private readonly repo: IRuleRepository,
    private readonly compiler: IRuleEngineCompiler,
  ) {}

  async execute(rule: UpdateNodeDTO) {
    let ruleChanges: UpdateRuleParams = { id: rule.id }
    if (rule.source) {
      const compiled = this.compiler.compile(rule.source) as RuleNode
      ruleChanges = {
        ...ruleChanges,
        name: compiled.name,
        target: compiled.target,
        trigger: compiled.trigger,
        priority: compiled.priority,
        ast: compiled,
        source: rule.source,
      }
    }
    if (rule.enabled != null) {
      ruleChanges = { ...ruleChanges, enabled: rule.enabled }
    }
    return this.repo.update(ruleChanges)
  }
}
