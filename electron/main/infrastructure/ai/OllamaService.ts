import { IAiService } from '@/application/ai/IAiService'
import { Config, Ollama } from 'ollama'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'

export class OllamaService implements IAiService {
  private ollama: Ollama
  private currentHost: string
  private busy: boolean = false

  constructor(settingsProvider: IAiSettingsProvider) {
    const settings = settingsProvider.settings
    this.currentHost = settings.host
    this.ollama = this.createClient(this.currentHost)

    settingsProvider.onHostChanged(this.reconnect)
  }
  // Functions that use models are wrapped in this as they are expensive
  // Methods like getVersion are lightweight and shouldn't be wrapped,
  // as they don't use models and therefore don't take many resources
  private async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    if (this.busy) {
      throw new Error(`OllamaService is busy`)
    }
    this.busy = true
    try {
      return await fn()
    } finally {
      this.busy = false
    }
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
  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.version()
      return true
    } catch {
      return false
    }
  }
  async embed(
    text: string,
    model: string = 'embeddinggemma',
  ): Promise<number[]> {
    return this.runExclusive(async () => {
      const response = await this.ollama.embeddings({
        model,
        prompt: text,
      })

      return response.embedding
    })
  }
}
