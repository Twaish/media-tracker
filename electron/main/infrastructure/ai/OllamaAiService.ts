import { IAiService } from '@/application/ai/aiService'
import ollama from 'ollama'

export class OllamaAiService implements IAiService {
  async getVersion(): Promise<string> {
    const version = await ollama.version()
    return version.version
  }
  async listModels(): Promise<string[]> {
    const modelsResponse = await ollama.list()
    const models = modelsResponse.models.map((m) => m.name)
    return models
  }
}
