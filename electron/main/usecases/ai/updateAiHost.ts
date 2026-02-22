import { IAiSettingsProvider } from '@/application/ai/IAiSettingsProvider'

export default class UpdateAiHost {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute(host: string) {
    return this.aiSettingsProvider.updateHost(host)
  }
}
