import { IRuleRepository } from '../domain/repositories/IRuleRepository'

export default class GetAllRules {
  constructor(private readonly repo: IRuleRepository) {}

  async execute() {
    return this.repo.getAll()
  }
}
