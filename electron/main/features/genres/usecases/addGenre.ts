import { AddGenreDTO } from '../application/dto/genre.dto'
import { IGenresRepository } from '../domain/repositories/IGenresRepository'

export default class AddGenre {
  constructor(private readonly repo: IGenresRepository) {}

  execute(genre: AddGenreDTO) {
    return this.repo.add(genre)
  }
}
