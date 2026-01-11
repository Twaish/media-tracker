import { GenresRepository } from '@/domain/repositories/genresRepository'

export default class GetGenres {
  constructor(private readonly repo: GenresRepository) {}

  execute() {
    return this.repo.get()
  }
}
