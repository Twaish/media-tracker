import { Modules } from '@/helpers/ipc/types'
import { createAiUseCases } from '../usecases'
import { os } from '@orpc/server'
import {
  AiCompatibilityResultDTOSchema,
  createEmbeddingInputSchema,
  createEmbeddingOutputSchema,
  getCapabilitiesInputSchema,
  getCapabilitiesOutputSchema,
  getSettingsOutputSchema,
  updateApiKeyInputSchema,
  updateHostInputSchema,
} from './schemas'

export function createAiRouters(modules: Modules) {
  const useCases = createAiUseCases(modules)

  return {
    checkCompatibility: os
      .output(AiCompatibilityResultDTOSchema)
      .handler(() => useCases.checkAiCompatibility.execute()),
    updateHost: os
      .input(updateHostInputSchema)
      .handler(({ input }) => useCases.updateAiHost.execute(input)),
    updateApiKey: os
      .input(updateApiKeyInputSchema)
      .handler(({ input }) => useCases.updateAiApiKey.execute(input)),
    getSettings: os
      .output(getSettingsOutputSchema)
      .handler(() => useCases.getAiSettings.execute()),
    createEmbedding: os
      .input(createEmbeddingInputSchema)
      .output(createEmbeddingOutputSchema)
      .handler(({ input }) =>
        useCases.createAiTextEmbedding.execute(input.text, input.model),
      ),
    getCapabilities: os
      .input(getCapabilitiesInputSchema)
      .output(getCapabilitiesOutputSchema)
      .handler(({ input }) => useCases.getAiModelCapabilities.execute(input)),
  }
}
