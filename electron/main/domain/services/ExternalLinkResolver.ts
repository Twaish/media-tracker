export class ExternalLinkResolver {
  private readonly SUPPORTED_PLACEHOLDERS = [
    '{{chapter}}',
    '{{episode}}',
    '{{index}}',
  ]

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

  async resolveExternalLink(
    template: string,
    index: number,
  ): Promise<string | null> {
    if (!template) {
      return null
    }

    const validation = this.validateTemplate(template)
    if (!validation.isValid) {
      return null
    }

    return template.replace(/{{(chapter|episode|index)}}/g, index.toString())
  }
}
