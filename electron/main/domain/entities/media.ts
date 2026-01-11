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

export class Media {
  constructor(
    public readonly id: number | null,
    public readonly title: string,
    public readonly currentEpisode: number,
    public readonly maxEpisodes: number,
    public readonly thumbnail: string,
    public readonly mediaType: MediaType,
    public readonly status: MediaStatus,
    public readonly externalLink: string,
    public readonly alternateTitles: string,
    public readonly watchAfter: number,
    public readonly lastUpdated: number,
    public readonly createdAt: number,
    public readonly isFavorite: boolean,
  ) {}
}
