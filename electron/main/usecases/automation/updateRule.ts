import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { RuleEngineCompiler } from '@/domain/automation/RuleEngineCompiler'
import { RuleNode } from '@/domain/automation/types'
import { UpdateRuleDTO, UpdateRuleRepoDTO } from '@shared/types/automation'

export default class UpdateRule {
  constructor(
    private readonly repo: IRuleRepository,
    private readonly compiler: RuleEngineCompiler,
  ) {}

  async execute(rule: UpdateRuleDTO) {
    let ruleChanges: UpdateRuleRepoDTO = { id: rule.id }
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
