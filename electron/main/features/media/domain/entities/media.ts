import { PersistedGenre } from '@/features/genres/domain/entities/genre'

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

export type MediaProps = {
  title: string
  currentEpisode: number
  maxEpisodes?: number | null
  thumbnail?: string | null
  type: MediaType
  status: MediaStatus
  externalLink?: string | null
  alternateTitles?: string | null
  watchAfter?: number | null
  lastUpdated?: Date | null
  createdAt?: Date | null
  isFavorite: boolean
  genres: PersistedGenre[]
  deletedAt?: Date | null
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
  get deletedAt() {
    return this.props.deletedAt
  }

  static create(props: MediaProps): Media {
    const mediaProps: MediaProps = {
      title: props.title,
      currentEpisode: props.currentEpisode ?? 0,
      maxEpisodes: props.maxEpisodes ?? null,
      thumbnail: props.thumbnail ?? null,
      type: props.type ?? 'anime',
      status: props.status ?? 'plan-to-watch',
      externalLink: props.externalLink ?? null,
      alternateTitles: props.alternateTitles ?? null,
      watchAfter: props.watchAfter ?? null,
      lastUpdated: props.lastUpdated ?? new Date(),
      createdAt: props.createdAt ?? new Date(),
      isFavorite: props.isFavorite ?? false,
      genres: props.genres ?? [],
      deletedAt: props.deletedAt ?? null,
    }

    return new Media(null, mediaProps)
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
