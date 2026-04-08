import { Pagination } from '@shared/types'
import { IDeltaRepository } from '../domain/repositories/IDeltaRepository'

export default class GetDeltas {
  constructor(private readonly repo: IDeltaRepository) {}

  async execute(options?: Pagination) {
    const deltas = await this.repo.get(options)
    return this.repo.get(options)
  }
}
