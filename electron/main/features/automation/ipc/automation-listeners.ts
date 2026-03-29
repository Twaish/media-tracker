import { AutomationContext } from '@shared/types'
import {
  RULE_ADD,
  RULE_ENGINE_SYNC,
  RULE_GET_ALL,
  RULE_GET_ENABLED,
  RULE_REMOVE,
  RULE_UPDATE,
  TEMPLATE_ADD,
  TEMPLATE_GET,
  TEMPLATE_REMOVE,
  TEMPLATE_UPDATE,
} from './automation-channels'
import { createAutomationUseCases } from '../usecases'
import { Modules } from '@/helpers/ipc/types'
import { registerIpcHandlers } from '@/helpers/ipc/register-ipc-handlers'

export function addAutomationEventListeners(modules: Modules) {
  const useCases = createAutomationUseCases(modules)

  registerIpcHandlers<AutomationContext>({
    syncEngine: [RULE_ENGINE_SYNC, () => useCases.syncRuleEngine.execute()],
    addRule: [RULE_ADD, (_, rule) => useCases.addRule.execute(rule)],
    updateRule: [RULE_UPDATE, (_, rule) => useCases.updateRule.execute(rule)],
    removeRules: [RULE_REMOVE, (_, ids) => useCases.removeRules.execute(ids)],
    getEnabledRules: [
      RULE_GET_ENABLED,
      () => useCases.getEnabledRules.execute(),
    ],
    getAllRules: [RULE_GET_ALL, () => useCases.getAllRules.execute()],
    addTemplate: [
      TEMPLATE_ADD,
      (_, template) => useCases.addTemplate.execute(template),
    ],
    updateTemplate: [
      TEMPLATE_UPDATE,
      (_, template) => useCases.updateTemplate.execute(template),
    ],
    removeTemplates: [
      TEMPLATE_REMOVE,
      (_, ids) => useCases.removeTemplates.execute(ids),
    ],
    getAllTemplates: [TEMPLATE_GET, () => useCases.getAllTemplates.execute()],
  })
}
