import { IAiService } from '@/application/ai/aiService'

export default class CheckAiCompatibility {
  constructor(private readonly aiService: IAiService) {}

  async execute() {
    try {
      const [version, models] = await Promise.all([
        this.aiService.getVersion(),
        this.aiService.listModels(),
      ])

      return {
        available: true,
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
        available: false,
        error: errorMessage,
      }
    }
  }
}
