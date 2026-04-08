import { IDeltaRepository } from '../domain/repositories/IDeltaRepository'

export default class RemoveDeltas {
  constructor(private readonly repo: IDeltaRepository) {}

  async execute(ids: number[]) {
    return this.repo.remove(ids)
  }
}
