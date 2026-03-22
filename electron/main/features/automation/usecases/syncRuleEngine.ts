import { IRuleEngine } from '../application/interfaces/IRuleEngine'
import { IRuleRepository } from '../domain/repositories/IRuleRepository'
import { ITemplateRepository } from '../domain/repositories/ITemplateRepository'

export default class SyncRuleEngine {
  constructor(
    private readonly ruleRepo: IRuleRepository,
    private readonly templateRepo: ITemplateRepository,
    private readonly ruleEngine: IRuleEngine,
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
