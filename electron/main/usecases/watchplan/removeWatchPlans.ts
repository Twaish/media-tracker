import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'

export default class RemoveWatchPlans {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute(ids: number[]) {
    return this.repo.remove(ids)
  }
}
