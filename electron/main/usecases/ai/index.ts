import { Modules } from '@/helpers/ipc/types'
import CheckAiCompatibility from './checkAiCompatibility'

export function createAiUseCases({ AiService }: Modules) {
  return {
    checkAiCompatibility: new CheckAiCompatibility(AiService),
  }
}
