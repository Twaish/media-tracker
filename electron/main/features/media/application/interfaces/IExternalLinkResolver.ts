export interface IExternalLinkResolver {
  validateTemplate(template: string): { isValid: boolean; reason?: string }
  resolveExternalLink(template: string, index: number): string | null
}
