import { createAiUseCases } from '@/usecases/ai'
import {
  AI_CHECK_COMPATIBILITY,
  AI_CREATE_EMBEDDING,
  AI_GET_CAPABILITIES,
  AI_GET_SETTINGS,
  AI_UPDATE_HOST,
} from './ai-channels'
import { Modules } from '../types'
import { registerIpcHandlers } from '../register-ipc-handlers'
import { AiContext } from '@shared/types'

export function addAiEventListeners(modules: Modules) {
  const useCases = createAiUseCases(modules)

  registerIpcHandlers<AiContext>({
    checkCompatibility: [
      AI_CHECK_COMPATIBILITY,
      () => useCases.checkAiCompatibility.execute(),
    ],
    updateHost: [
      AI_UPDATE_HOST,
      (_, host) => useCases.updateAiHost.execute(host),
    ],
    getSettings: [AI_GET_SETTINGS, () => useCases.getAiSettings.execute()],
    createEmbedding: [
      AI_CREATE_EMBEDDING,
      (_, text, model?) => useCases.createAiTextEmbedding.execute(text, model),
    ],
    getCapabilities: [
      AI_GET_CAPABILITIES,
      (_, model) => useCases.getAiModelCapabilities.execute(model),
    ],
  })
}
