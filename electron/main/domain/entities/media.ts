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
  mediaType: MediaType
  status: MediaStatus
  externalLink: string
  alternateTitles: string
  watchAfter: number | null
  lastUpdated: Date | null
  createdAt: Date | null
  isFavorite: boolean
  genres: GenreDTO[]
}

export class Media {
  private constructor(
    private readonly id: number | null,
    private readonly title: string,
    private readonly currentEpisode: number,
    private readonly maxEpisodes: number | null,
    private readonly thumbnail: string | null,
    private readonly mediaType: MediaType,
    private readonly status: MediaStatus,
    private readonly externalLink: string,
    private readonly alternateTitles: string,
    private readonly watchAfter: number | null,
    private readonly lastUpdated: Date | null,
    private readonly createdAt: Date | null,
    private readonly isFavorite: boolean,
    private readonly genres: GenreDTO[],
  ) {}

  static create(params: Omit<MediaParams, 'id'>): Media {
    const {
      title,
      currentEpisode = 0,
      maxEpisodes,
      thumbnail,
      mediaType = 'anime',
      status = 'plan-to-watch',
      externalLink = '/',
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
      mediaType,
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
