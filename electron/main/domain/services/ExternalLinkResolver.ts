import { IMediaRepository } from '@/application/db/repositories/IMediaRepository'

export class ExternalLinkResolver {
  private readonly SUPPORTED_PLACEHOLDERS = [
    '{{chapter}}',
    '{{episode}}',
    '{{index}}',
  ]

  constructor(private repo: IMediaRepository) {}

  public validateTemplate(template: string): {
    isValid: boolean
    reason?: string
  } {
    try {
      new URL(template.replace(/{{.*?}}/g, 'placeholder'))
    } catch {
      return {
        isValid: false,
        reason: 'Template is not a valid URL structure',
      }
    }

    const hasPlaceholder = this.SUPPORTED_PLACEHOLDERS.some((p) =>
      template.includes(p),
    )
    if (!hasPlaceholder) {
      return {
        isValid: false,
        reason: `Template must contain one of: ${this.SUPPORTED_PLACEHOLDERS.join(', ')}`,
      }
    }

    return { isValid: true }
  }

  async resolveExternalUrl(
    mediaId: number,
    index: number,
  ): Promise<string | null> {
    const media = await this.repo.getById(mediaId)
    if (!media) {
      return null
    }

    const externalLink = media.getExternalLink()
    if (!externalLink) {
      return null
    }

    const validation = this.validateTemplate(externalLink)
    if (!validation.isValid) {
      return null
    }

    return externalLink.replace(
      /{{(chapter|episode|index)}}/g,
      index.toString(),
    )
  }
}
