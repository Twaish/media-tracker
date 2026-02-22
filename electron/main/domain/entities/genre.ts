export type GenreProps = {
  name: string
  isDeletable: boolean
}

export type PersistedGenre = GenreProps & {
  id: number
}

export class Genre {
  private constructor(
    public readonly id: number | null,
    public readonly props: GenreProps,
  ) {}

  get name() {
    return this.props.name
  }
  get isDeletable() {
    return this.props.isDeletable
  }

  static create(props: GenreProps): Genre {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Genre name cannot be empty')
    }

    if (props.name.length > 25) {
      throw new Error('Genre name cannot exceed 25 characters')
    }

    return new Genre(null, props)
  }

  withId(id: number) {
    return new Genre(id, this.props)
  }

  toDTO(): PersistedGenre {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved Genre to DTO`)
    }
    return {
      id: this.id,
      ...this.props,
    }
  }
}
