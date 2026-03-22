import { IAiSettingsProvider } from '../application/ports/IAiSettingsProvider'

export default class UpdateAiApiKey {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute(apiKey: string) {
    return this.aiSettingsProvider.updateApiKey(apiKey)
  }
}
