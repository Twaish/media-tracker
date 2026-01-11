export class Genre {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly isDeletable: boolean,
  ) {
    if (!name.trim()) {
      throw new Error('Genre name cannot be empty')
    }
  }

  static create(params: {
    id: number
    name: string
    isDeletable: boolean
  }): Genre {
    if (!params.name || params.name.trim().length === 0) {
      throw new Error('Genre name cannot be empty')
    }

    if (params.name.length > 25) {
      throw new Error('Genre name cannot exceed 25 characters')
    }

    return new Genre(params.id, params.name.trim(), params.isDeletable)
  }
}
