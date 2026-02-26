import { Media, MediaProps, PersistedMedia } from '@/domain/entities/media'

export function makeMedia(
  overrides: Partial<MediaProps> & { id: number },
): PersistedMedia

export function makeMedia(
  overrides?: Partial<MediaProps> & { id?: undefined },
): MediaProps

export function makeMedia(
  overrides?: Partial<MediaProps> & { id?: number },
): MediaProps | PersistedMedia {
  const { id, ...rest } = overrides ?? {}
  const media = Media.create({
    title: 'Test',
    currentEpisode: 1,
    maxEpisodes: null,
    thumbnail: 'image/path',
    type: 'anime',
    status: 'plan-to-watch',
    externalLink: 'http://link.test/',
    alternateTitles: '',
    watchAfter: null,
    lastUpdated: null,
    createdAt: null,
    isFavorite: false,
    genres: [],
    deletedAt: null,
    ...rest,
  })
  return id ? media.withId(id) : media
}
