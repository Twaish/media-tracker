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

type MediaParams = {
  id: number | null
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

export class Media {
  private constructor(
    public readonly id: number | null,
    public readonly title: string,
    public readonly currentEpisode: number,
    public readonly maxEpisodes: number | null,
    public readonly thumbnail: string | null,
    public readonly mediaType: MediaType,
    public readonly status: MediaStatus,
    public readonly externalLink: string | null,
    public readonly alternateTitles: string,
    public readonly watchAfter: number | null,
    public readonly lastUpdated: Date | null,
    public readonly createdAt: Date | null,
    public readonly isFavorite: boolean,
    public readonly genres: GenreDTO[],
  ) {}

  static create(params: Omit<MediaParams, 'id'>): Media {
    const {
      title,
      currentEpisode = 0,
      maxEpisodes,
      thumbnail,
      type = 'anime',
      status = 'plan-to-watch',
      externalLink,
      alternateTitles = '',
      watchAfter,
      lastUpdated = new Date(),
      createdAt = new Date(),
      isFavorite = false,
      genres = [],
    } = params

    return new Media(
      null,
      title,
      currentEpisode,
      maxEpisodes,
      thumbnail,
      type,
      status,
      externalLink,
      alternateTitles,
      watchAfter,
      lastUpdated,
      createdAt,
      isFavorite,
      genres,
    )
  }

  withId(id: number) {
    return new Media(
      id,
      this.title,
      this.currentEpisode,
      this.maxEpisodes,
      this.thumbnail,
      this.mediaType,
      this.status,
      this.externalLink,
      this.alternateTitles,
      this.watchAfter,
      this.lastUpdated,
      this.createdAt,
      this.isFavorite,
      this.genres,
    )
  }
}
