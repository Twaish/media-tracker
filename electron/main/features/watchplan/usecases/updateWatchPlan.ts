import { UpdateWatchPlanDTO } from '../application/dto/watchPlan.dto'
import { IWatchPlanRepository } from '../domain/repositories/IWatchPlanRepository'

export default class UpdateWatchPlan {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute(watchPlan: UpdateWatchPlanDTO) {
    return this.repo.update(watchPlan)
  }
}
