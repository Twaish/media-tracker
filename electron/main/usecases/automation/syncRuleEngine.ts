import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { ITemplateRepository } from '@/application/db/repositories/ITemplateRepository'
import { RuleEngine } from '@/domain/automation/RuleEngine'

export default class SyncRuleEngine {
  constructor(
    private readonly ruleRepo: IRuleRepository,
    private readonly templateRepo: ITemplateRepository,
    private readonly ruleEngine: RuleEngine,
  ) {}

  async execute() {
    const [enabledRules, allTemplates] = await Promise.all([
      this.ruleRepo.getAllEnabled(),
      this.templateRepo.getAll(),
    ])

    allTemplates.forEach((template) =>
      this.ruleEngine.registerTemplate(template.ast),
    )

    enabledRules.forEach((rule) => this.ruleEngine.registerRule(rule.ast))
  }
}
