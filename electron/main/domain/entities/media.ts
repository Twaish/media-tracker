export const MEDIA_TYPES = ['anime', 'manga', 'manhwa', 'manhua'] as const
export const MEDIA_STATUS = [
  'watching',
  'completed',
  'on-hold',
  'dropped',
  'plan-to-watch',
] as const

export type MediaType = (typeof MEDIA_TYPES)[number]
export type MediaStatus = (typeof MEDIA_STATUS)[number]

export type GenreDTO = {
  id: number
  name: string
}

type MediaProps = {
  title: string
  currentEpisode: number
  maxEpisodes: number | null
  thumbnail: string | null
  type: MediaType
  status: MediaStatus
  externalLink: string | null
  alternateTitles: string
  watchAfter: number | null
  lastUpdated: Date | null
  createdAt: Date | null
  isFavorite: boolean
  genres: GenreDTO[]
}

export type PersistedMedia = MediaProps & {
  id: number
}

export class Media {
  private constructor(
    public readonly id: number | null,
    public readonly props: MediaProps,
  ) {}

  get title() {
    return this.props.title
  }
  get currentEpisode() {
    return this.props.currentEpisode
  }
  get maxEpisodes() {
    return this.props.maxEpisodes
  }
  get thumbnail() {
    return this.props.thumbnail
  }
  get type() {
    return this.props.type
  }
  get status() {
    return this.props.status
  }
  get externalLink() {
    return this.props.externalLink
  }
  get alternateTitles() {
    return this.props.alternateTitles
  }
  get watchAfter() {
    return this.props.watchAfter
  }
  get lastUpdated() {
    return this.props.lastUpdated
  }
  get createdAt() {
    return this.props.createdAt
  }
  get isFavorite() {
    return this.props.isFavorite
  }
  get genres() {
    return this.props.genres
  }

  static create(input: MediaProps): Media {
    const props: MediaProps = {
      title: input.title,
      currentEpisode: input.currentEpisode ?? 0,
      maxEpisodes: input.maxEpisodes ?? null,
      thumbnail: input.thumbnail ?? null,
      type: input.type ?? 'anime',
      status: input.status ?? 'plan-to-watch',
      externalLink: input.externalLink ?? null,
      alternateTitles: input.alternateTitles ?? '',
      watchAfter: input.watchAfter ?? null,
      lastUpdated: input.lastUpdated ?? new Date(),
      createdAt: input.createdAt ?? new Date(),
      isFavorite: input.isFavorite ?? false,
      genres: input.genres ?? [],
    }

    return new Media(null, props)
  }

  withId(id: number) {
    return new Media(id, this.props)
  }

  toDTO(): PersistedMedia {
    if (this.id === null) {
      throw new Error(`Cannot convert unsaved Media to DTO`)
    }
    return {
      id: this.id,
      ...this.props,
    }
  }
}
