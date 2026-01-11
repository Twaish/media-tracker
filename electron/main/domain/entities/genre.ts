export const DEFAULT_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Thriller',
] as const

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
}
