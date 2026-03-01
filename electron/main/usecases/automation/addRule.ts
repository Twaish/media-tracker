import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'
import { AddRuleDTO } from '@shared/types/automation'

export default class AddRule {
  constructor(private readonly repo: IRuleRepository) {}

  async execute(rule: AddRuleDTO) {
    return this.repo.add(rule)
  }
}
