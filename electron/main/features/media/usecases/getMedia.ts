import { IMediaRepository } from '../domain/repositories/IMediaRepository'
import { Pagination } from '@shared/types'

export default class GetMedia {
  constructor(private readonly repo: IMediaRepository) {}

  async execute(options: Pagination) {
    return this.repo.getWithPagination(options)
  }
}
