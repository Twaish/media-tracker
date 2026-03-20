import { Modules } from '@/helpers/ipc/types'
import CheckAiCompatibility from './checkAiCompatibility'
import UpdateAiHost from './updateAiHost'
import GetAiSettings from './getAiSettings'
import CreateAiTextEmbedding from './createAiTextEmbedding'
import GetAiModelCapabilities from './getAiModelCapabilities'
import UpdateAiApiKey from './updateAiApiKey'

export function createAiUseCases({ AiService, AiSettingsProvider }: Modules) {
  return {
    checkAiCompatibility: new CheckAiCompatibility(AiService),
    updateAiHost: new UpdateAiHost(AiSettingsProvider),
    updateAiApiKey: new UpdateAiApiKey(AiSettingsProvider),
    getAiSettings: new GetAiSettings(AiSettingsProvider),
    createAiTextEmbedding: new CreateAiTextEmbedding(AiService),
    getAiModelCapabilities: new GetAiModelCapabilities(AiService),
  }
}
