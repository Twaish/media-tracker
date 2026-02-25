import { Modules } from '@/helpers/ipc/types'
import CheckAiCompatibility from './checkAiCompatibility'
import UpdateAiHost from './updateAiHost'
import GetAiSettings from './getAiSettings'
import CreateAiTextEmbedding from './createAiTextEmbedding'

export function createAiUseCases({ AiService, AiSettingsProvider }: Modules) {
  return {
    checkAiCompatibility: new CheckAiCompatibility(AiService),
    updateAiHost: new UpdateAiHost(AiSettingsProvider),
    getAiSettings: new GetAiSettings(AiSettingsProvider),
    createAiTextEmbedding: new CreateAiTextEmbedding(AiService),
  }
}
