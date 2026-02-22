import { IWatchPlanRepository } from '@/application/db/repositories/IWatchPlanRepository'
import { WatchPlanUpdateInput } from '@shared/types/watchPlans'

export default class UpdateWatchPlan {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute(watchPlan: WatchPlanUpdateInput) {
    return this.repo.update(watchPlan)
  }
}
