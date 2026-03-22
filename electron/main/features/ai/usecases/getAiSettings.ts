import { IAiSettingsProvider } from '../application/ports/IAiSettingsProvider'

export default class GetAiSettings {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute() {
    return this.aiSettingsProvider.settings
  }
}
