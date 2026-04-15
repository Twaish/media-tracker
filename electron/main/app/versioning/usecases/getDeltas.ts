import { Pagination } from '@shared/types'
import { IDeltaRepository } from '../domain/repositories/IDeltaRepository'

export default class GetDeltas {
  constructor(private readonly repo: IDeltaRepository) {}

  async execute(options?: Pagination) {
    return this.repo.get(options)
  }
}
