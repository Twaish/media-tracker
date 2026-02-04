import { Media } from '@/domain/entities/media'

export function makeMedia(
  overrides?: Partial<Parameters<typeof Media.create>[0]> & { id?: number },
): Media {
  const { id, ...rest } = overrides ?? {}
  let media = Media.create({
    title: 'Test',
    currentEpisode: 1,
    maxEpisodes: null,
    thumbnail: 'image/path',
    mediaType: 'anime',
    status: 'plan-to-watch',
    externalLink: 'http://link.test/',
    alternateTitles: '',
    watchAfter: null,
    lastUpdated: null,
    createdAt: null,
    isFavorite: false,
    genres: [],
    ...rest,
  })
  return id ? media.withId(id) : media
}
