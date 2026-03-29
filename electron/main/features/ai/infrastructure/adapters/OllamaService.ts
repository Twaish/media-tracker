import { Config, Ollama } from 'ollama'

import { IAiService } from '../../application/ports/IAiService'
import { IAiSettingsProvider } from '../../application/ports/IAiSettingsProvider'

export class OllamaService implements IAiService {
  private ollama: Ollama
  private currentHost: string
  private busy: boolean = false

  private readonly settingsProvider: IAiSettingsProvider

  constructor(settingsProvider: IAiSettingsProvider) {
    this.settingsProvider = settingsProvider
    this.currentHost = settingsProvider.settings.host
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
    const apiKey = this.settingsProvider.settings.apiKey
    if (apiKey) {
      process.env['OLLAMA_API_KEY'] = apiKey
    }
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
  async getModelCapabilities(model: string): Promise<string[]> {
    const client = this.ollama
    const modelInfo = await client.show({ model })
    return modelInfo.capabilities
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
  async generateJson<T>(prompt: string, model: string): Promise<T> {
    return this.runExclusive(async () => {
      const response = await this.ollama.generate({
        model,
        prompt,
        format: 'json',
        stream: false,
      })

      const parsed = JSON.parse(response.response)
      return parsed as T
    })
  }
  // TODO: Currently bad, try filtering data manually using fetch()
  async webFetch(url: string): Promise<string> {
    return this.runExclusive(async () => {
      const apiKey = this.settingsProvider.settings.apiKey
      if (apiKey) {
        process.env['OLLAMA_API_KEY'] = apiKey
      }
      const response = await this.ollama.webFetch({ url })
      return response.content
    })
  }
}
