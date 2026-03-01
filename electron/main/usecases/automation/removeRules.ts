import { IRuleRepository } from '@/application/db/repositories/IRuleRepository'

export default class RemoveRules {
  constructor(private readonly repo: IRuleRepository) {}

  async execute(ids: number[]) {
    return this.repo.remove(ids)
  }
}
