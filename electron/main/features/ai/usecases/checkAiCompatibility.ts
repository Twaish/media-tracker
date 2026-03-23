import { IAiService } from '../application/ports/IAiService'
import { AiCompatibilityResultDTO } from '@/features/ai/application/dto/AiCompatibilityResult'

export default class CheckAiCompatibility {
  constructor(private readonly aiService: IAiService) {}

  async execute(): Promise<AiCompatibilityResultDTO> {
    try {
      const [version, models] = await Promise.all([
        this.aiService.getVersion(),
        this.aiService.listModels(),
      ])

      return {
        available: true as const,
        version,
        models,
      }
    } catch (err) {
      const errorMessage =
        typeof err === 'string'
          ? err
          : err instanceof Error
            ? err.message
            : 'Ollama not available'
      return {
        available: false as const,
        error: errorMessage,
      }
    }
  }
}
