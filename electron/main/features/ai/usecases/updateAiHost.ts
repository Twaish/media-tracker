import { IAiSettingsProvider } from '../application/ports/IAiSettingsProvider'

export default class UpdateAiHost {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute(host: string) {
    return this.aiSettingsProvider.updateHost(host)
  }
}
