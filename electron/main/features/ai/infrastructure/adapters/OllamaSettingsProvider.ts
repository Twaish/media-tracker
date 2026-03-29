import EventEmitter from 'events'

import { IAiSettingsProvider } from '../../application/ports/IAiSettingsProvider'
import {
  ISettingsBuilder,
  Schema,
  SettingsInterface,
} from '@/application/ports/settings/ISettingsBuilder'
import { AiSettings } from '../../domain/models/AiSettings'

export const settingsSchema = {
  host: { default: 'http://localhost:11434/' },
  apiKey: { secret: true },
} satisfies Schema

export class OllamaSettingsProvider
  extends EventEmitter
  implements IAiSettingsProvider
{
  private readonly filename = 'ollama-settings'
  private _settings: SettingsInterface<typeof settingsSchema>

  constructor(builder: ISettingsBuilder) {
    super()
    this._settings = builder.defineSettings('ai', this.filename, settingsSchema)
  }

  get settings(): AiSettings {
    return { ...this._settings.getAll() }
  }

  onHostChanged(listener: (host: string) => void): () => void {
    this.on('hostChanged', listener)
    return () => this.off('hostChanged', listener)
  }

  async init() {
    await this._settings.init()
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
    if (this._settings.getAll().host === newHost) return

    const normalizedHost = this.normalizeHost(newHost)

    await this._settings.set('host', normalizedHost)

    this.emit('hostChanged', normalizedHost)
  }

  async updateApiKey(apiKey: string) {
    this._settings.set('apiKey', apiKey)
    this.emit('apiKeyChanged', apiKey)
  }
}
