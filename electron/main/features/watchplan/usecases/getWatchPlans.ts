import { IWatchPlanRepository } from '../domain/repositories/IWatchPlanRepository'

export default class GetWatchPlans {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute() {
    return this.repo.getAll()
  }
}
