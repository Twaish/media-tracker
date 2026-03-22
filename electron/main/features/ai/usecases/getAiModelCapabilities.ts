import { IAiService } from '../application/ports/IAiService'

export default class GetAiModelCapabilities {
  constructor(private readonly aiService: IAiService) {}

  async execute(model: string) {
    return this.aiService.getModelCapabilities(model)
  }
}
