import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'

export default class UpdateAiApiKey {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute(apiKey: string) {
    return this.aiSettingsProvider.updateApiKey(apiKey)
  }
}
