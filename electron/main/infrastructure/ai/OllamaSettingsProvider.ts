import EventEmitter from 'events'
import { JsonStore } from '@/core/JsonStore'
import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'
import { AiSettings } from '@/application/ai/AiSettings'
import { safeStorage } from 'electron'

export class OllamaSettingsProvider
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
      if (saved.apiKey && safeStorage.isEncryptionAvailable()) {
        try {
          const buffer = Buffer.from(saved.apiKey, 'base64')
          saved.apiKey = safeStorage.decryptString(buffer)
        } catch {
          // Failed to decrypt, could be unencrypted or key changed
        }
      }
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

    const settingsToSave = { ...this._settings }
    if (settingsToSave.apiKey && safeStorage.isEncryptionAvailable()) {
      settingsToSave.apiKey = safeStorage
        .encryptString(settingsToSave.apiKey)
        .toString('base64')
    }

    await this.store.set(this.filename, settingsToSave)

    this.emit('hostChanged', normalizedHost)
  }

  async updateApiKey(apiKey: string) {
    if (this._settings.apiKey === apiKey) return

    this._settings.apiKey = apiKey

    const settingsToSave = { ...this._settings }
    if (apiKey && safeStorage.isEncryptionAvailable()) {
      settingsToSave.apiKey = safeStorage
        .encryptString(apiKey)
        .toString('base64')
    }

    await this.store.set(this.filename, settingsToSave)
    this.emit('apiKeyChanged', apiKey)
  }
}
