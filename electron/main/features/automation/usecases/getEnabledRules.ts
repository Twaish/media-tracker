import { IRuleRepository } from '../domain/repositories/IRuleRepository'

export default class GetEnabledRules {
  constructor(private readonly repo: IRuleRepository) {}

  async execute() {
    return this.repo.getAllEnabled()
  }
}
