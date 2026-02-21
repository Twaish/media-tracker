import { IAiService } from '@/application/ai/IAiService'
import { Ollama } from 'ollama'

// TODO: Allow user to define host through options/settings
export class OllamaAiService implements IAiService {
  ollama: Ollama
  constructor() {
    this.ollama = new Ollama({
      host: 'http://localhost:11434',
    })
  }

  async getVersion(): Promise<string> {
    const version = await this.ollama.version()
    return version.version
  }
  async listModels(): Promise<string[]> {
    const modelsResponse = await this.ollama.list()
    const models = modelsResponse.models.map((m) => m.name)
    return models
  }
}
