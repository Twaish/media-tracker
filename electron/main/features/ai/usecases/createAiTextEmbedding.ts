import { IAiService } from '../application/ports/IAiService'

export default class CreateAiTextEmbedding {
  constructor(private readonly aiService: IAiService) {}

  async execute(text: string, model?: string) {
    return this.aiService.embed(text, model)
  }
}
