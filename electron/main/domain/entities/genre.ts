export class Genre {
  private constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly isDeletable: boolean,
  ) {}

  static create(params: { name: string; isDeletable: boolean }): Genre {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('Genre name cannot be empty')
    }

    if (params.name.length > 25) {
      throw new Error('Genre name cannot exceed 25 characters')
    }

    return new Genre(null, params.name.trim(), params.isDeletable)
  }

  withId(id: number) {
    return new Genre(id, this.name, this.isDeletable)
  }
}
