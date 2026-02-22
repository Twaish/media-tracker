import { IAiService } from '@/application/ai/IAiService'
import { Config, Ollama } from 'ollama'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'

export class OllamaAiService implements IAiService {
  ollama: Ollama
  currentHost: string
  generation = 0
  constructor(settings: IAiSettingsProvider) {
    this.currentHost = settings.host
    this.ollama = this.createClient(settings.host)

    settings.onHostChanged(this.reconnect)
  }
  private createClient(
    host: string,
    options: Partial<Omit<Config, 'host'>> = {},
  ): Ollama {
    return new Ollama({ host, ...options })
  }
  private reconnect = (host: string) => {
    if (this.currentHost === host) return

    this.currentHost = host
    this.ollama.abort()
    this.ollama = this.createClient(host)
  }
  async getVersion(): Promise<string> {
    const client = this.ollama
    const version = await client.version()
    return version.version
  }
  async listModels(): Promise<string[]> {
    const client = this.ollama
    const modelsResponse = await client.list()
    const models = modelsResponse.models.map((m) => m.name)
    return models
  }
}
