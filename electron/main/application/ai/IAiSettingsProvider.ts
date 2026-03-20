import { AiSettings } from './AiSettings'

export interface IAiSettingsProvider {
  settings: AiSettings
  init(): Promise<void>
  updateHost(newHost: string): Promise<void>
  updateApiKey(apiKey: string): Promise<void>
  onHostChanged(listener: (host: string) => void): () => void
}
