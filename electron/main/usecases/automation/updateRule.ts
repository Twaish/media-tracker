import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { UpdateRuleDTO } from '@shared/types/automation'

export default class UpdateRule {
  constructor(private readonly repo: IRuleRepository) {}

  async execute(rule: UpdateRuleDTO) {
    return this.repo.update(rule)
  }
}
