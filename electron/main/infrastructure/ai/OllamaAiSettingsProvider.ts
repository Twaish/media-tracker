import EventEmitter from 'events'
import { JsonStore } from '@/core/JsonStore'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'
import { AiSettings } from '@/application/ai/AiSettings'

export class OllamaAiSettingsProvider
  extends EventEmitter
  implements IAiSettingsProvider
{
  private readonly filename = 'ollama-settings'
  private settings: AiSettings
  private store: JsonStore

  constructor(store: JsonStore) {
    super()
    this.store = store
    this.settings = { host: 'http://localhost:11434/' }
  }

  onHostChanged(listener: (host: string) => void): () => void {
    this.on('hostChanged', listener)
    return () => this.off('hostChanged', listener)
  }

  async init() {
    const saved = await this.store.get<AiSettings>(this.filename)

    if (saved) {
      this.settings = saved
    } else {
      await this.store.set(this.filename, this.settings)
    }
  }

  get host(): string {
    return this.settings.host
  }

  private normalizeHost(host: string) {
    try {
      const url = new URL(host)
      return url.origin + '/'
    } catch {
      throw new Error(`Invalid host URL: ${host}`)
    }
  }

  async updateHost(newHost: string) {
    if (this.settings.host === newHost) return

    const normalizedHost = this.normalizeHost(newHost)
    this.settings.host = normalizedHost

    await this.store.set(this.filename, this.settings)

    this.emit('hostChanged', normalizedHost)
  }
}
