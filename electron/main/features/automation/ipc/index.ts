import { Modules } from '@/helpers/ipc/types'
import { createAutomationUseCases } from '../usecases'
import { os } from '@orpc/server'
import {
  addNodeInputSchema,
  updateNodeInputSchema,
  getAllRulesOutputSchema,
  getEnabledRulesOutputSchema,
  persistedRuleSchema,
  removeNodesInputSchema,
  removeNodesOutputSchema,
  persistedTemplateSchema,
  getAllTemplatesOutputSchema,
} from './schemas'

export function createAutomationRouters(modules: Modules) {
  const useCases = createAutomationUseCases(modules)

  return {
    syncEngine: os.handler(() => useCases.syncRuleEngine.execute()),

    addRule: os
      .input(addNodeInputSchema)
      .output(persistedRuleSchema)
      .handler(({ input }) => useCases.addRule.execute(input)),
    updateRule: os
      .input(updateNodeInputSchema)
      .output(persistedRuleSchema)
      .handler(({ input }) => useCases.updateRule.execute(input)),
    removeRules: os
      .input(removeNodesInputSchema)
      .output(removeNodesOutputSchema)
      .handler(({ input }) => useCases.removeRules.execute(input)),
    getEnabledRules: os
      .output(getEnabledRulesOutputSchema)
      .handler(() => useCases.getEnabledRules.execute()),
    getAllRules: os
      .output(getAllRulesOutputSchema)
      .handler(() => useCases.getAllRules.execute()),

    addTemplate: os
      .input(addNodeInputSchema)
      .output(persistedTemplateSchema)
      .handler(({ input }) => useCases.addTemplate.execute(input)),
    updateTemplate: os
      .input(updateNodeInputSchema)
      .output(persistedTemplateSchema)
      .handler(({ input }) => useCases.updateTemplate.execute(input)),
    removeTemplates: os
      .input(removeNodesInputSchema)
      .output(removeNodesOutputSchema)
      .handler(({ input }) => useCases.removeTemplates.execute(input)),
    getAllTemplates: os
      .output(getAllTemplatesOutputSchema)
      .handler(() => useCases.getAllTemplates.execute()),
  }
}
