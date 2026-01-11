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
}

export class Media {
  private constructor(private readonly props: MediaParams) {}

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
      isFavorite,
    } = params

    return new Media({
      id: null,
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
    })
  }

  withId(id: number) {
    return new Media({ ...this.props, id })
  }

  get id() {
    return this.props.id
  }
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
  get mediaType() {
    return this.props.mediaType
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
}
