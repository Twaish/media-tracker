import { IAiSettingsProvider } from '../application/ports/IAiSettingsProvider'
import { AiSettings } from '../domain/models/AiSettings'

export default class GetAiSettings {
  constructor(private readonly aiSettingsProvider: IAiSettingsProvider) {}

  async execute(): Promise<AiSettings> {
    return this.aiSettingsProvider.settings
  }
}
