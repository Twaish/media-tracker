import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'
import { WatchPlanCreateInput } from '@shared/types/watchPlans'

export default class AddWatchPlan {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute(watchPlan: WatchPlanCreateInput) {
    return this.repo.add(watchPlan)
  }
}
