import { IGenresRepository } from '@/application/db/repositories/IGenresRepository'

export default class GetGenres {
  constructor(private readonly repo: IGenresRepository) {}

  execute() {
    return this.repo.get()
  }
}
