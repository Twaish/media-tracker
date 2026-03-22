import { IGenresRepository } from '../domain/repositories/IGenresRepository'

export default class GetGenreById {
  constructor(private readonly repo: IGenresRepository) {}

  execute(genreId: number) {
    return this.repo.getById(genreId)
  }
}
