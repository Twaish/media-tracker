import { ExternalLinkResolver } from '@/domain/services/ExternalLinkResolver'

export default class ResolveExternalMediaLink {
  constructor(private readonly resolver: ExternalLinkResolver) {}

  async execute(mediaId: number, index: number) {
    return this.resolver.resolveExternalUrl(mediaId, index)
  }
}
