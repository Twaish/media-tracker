import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'

export default class ResolveExternalMediaLink {
  constructor(
    private readonly repo: IMediaRepository,
    private readonly resolver: ExternalLinkResolver,
  ) {}

  async execute(mediaId: number) {
    const media = await this.repo.getById(mediaId)
    if (!media) {
      return null
    }

    const externalLink = media.getExternalLink()
    if (!externalLink) {
      return null
    }

    let nextEpisode = media.getCurrentEpisode() + 1
    const maxEpisodes = media.getMaxEpisodes()
    if (maxEpisodes) {
      nextEpisode = nextEpisode > maxEpisodes ? maxEpisodes : nextEpisode
    }

    return this.resolver.resolveExternalLink(externalLink, nextEpisode)
  }
}
