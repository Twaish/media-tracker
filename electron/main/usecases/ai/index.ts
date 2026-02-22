import { Modules } from '@/helpers/ipc/types'
import CheckAiCompatibility from './checkAiCompatibility'
import UpdateAiHost from './updateAiHost'

export function createAiUseCases({ AiService, AiSettingsProvider }: Modules) {
  return {
    checkAiCompatibility: new CheckAiCompatibility(AiService),
    updateAiHost: new UpdateAiHost(AiSettingsProvider),
  }
}
