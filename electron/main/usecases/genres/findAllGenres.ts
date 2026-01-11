import { GenresRepository } from '@/domain/repositories/genresRepository'

export default class FindAllGenres {
  constructor(private readonly repo: GenresRepository) {}

  execute() {
    return this.repo.findAll()
  }
}
