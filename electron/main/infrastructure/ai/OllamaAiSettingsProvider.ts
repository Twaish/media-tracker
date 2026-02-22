import EventEmitter from 'events'
import { JsonStore } from '@/core/JsonStore'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'
import { AiSettings } from '@/application/ai/AiSettings'

export class OllamaAiSettingsProvider
  extends EventEmitter
  implements IAiSettingsProvider
{
  private readonly filename = 'ollama-settings'
  private _settings: AiSettings
  private store: JsonStore

  constructor(store: JsonStore) {
    super()
    this.store = store
    this._settings = { host: 'http://localhost:11434/' }
  }

  onHostChanged(listener: (host: string) => void): () => void {
    this.on('hostChanged', listener)
    return () => this.off('hostChanged', listener)
  }

  async init() {
    const saved = await this.store.get<AiSettings>(this.filename)

    if (saved) {
      this._settings = saved
    } else {
      await this.store.set(this.filename, this._settings)
    }
  }

  get settings() {
    return { ...this._settings }
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
    if (this._settings.host === newHost) return

    const normalizedHost = this.normalizeHost(newHost)
    this._settings.host = normalizedHost

    await this.store.set(this.filename, this._settings)

    this.emit('hostChanged', normalizedHost)
  }
}
