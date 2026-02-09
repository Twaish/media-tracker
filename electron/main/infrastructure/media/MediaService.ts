import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'
import { IMediaService } from '@/application/media/IMediaService'

export class MediaService implements IMediaService {
  constructor(private repo: IMediaRepository) {}

  async resolveExternalUrl(
    mediaId: number,
    index: number,
  ): Promise<string | null> {
    const media = await this.repo.getById(mediaId)
    const externalLink = media.getExternalLink()

    if (!media || !externalLink) {
      return null
    }

    const replacements: Record<string, string> = {
      '{{chapter}}': index.toString(),
      '{{episode}}': index.toString(),
      '{{index}}': index.toString(),
    }

    return externalLink.replace(
      /{{chapter}}|{{episode}}|{{index}}/g,
      (matched) => replacements[matched],
    )
  }
}
