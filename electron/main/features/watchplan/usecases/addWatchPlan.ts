import { AddWatchPlanDTO } from '../application/dto/watchPlan.dto'
import { IWatchPlanRepository } from '../domain/repositories/IWatchPlanRepository'

export default class AddWatchPlan {
  constructor(private readonly repo: IWatchPlanRepository) {}

  async execute(watchPlan: AddWatchPlanDTO) {
    return this.repo.add(watchPlan)
  }
}
