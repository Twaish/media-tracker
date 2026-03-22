import { AiContext } from '@shared/types'
import {
  AI_CHECK_COMPATIBILITY,
  AI_CREATE_EMBEDDING,
  AI_GET_CAPABILITIES,
  AI_GET_SETTINGS,
  AI_UPDATE_HOST,
  AI_UPDATE_API_KEY,
} from './ai-channels'
import { createAiUseCases } from '../usecases'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

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
    updateApiKey: [
      AI_UPDATE_API_KEY,
      (_, key) => useCases.updateAiApiKey.execute(key),
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
