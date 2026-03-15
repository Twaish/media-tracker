import { createAutomationUseCases } from '@/usecases/automation'
import { Modules } from '../types'
import {
  RULE_ADD,
  RULE_ENGINE_SYNC,
  RULE_GET_ENABLED,
  RULE_REMOVE,
  RULE_UPDATE,
  TEMPLATE_ADD,
  TEMPLATE_GET,
  TEMPLATE_REMOVE,
  TEMPLATE_UPDATE,
} from './automation-channels'
import { AutomationContext } from '@shared/types/automation'
import { registerIpcHandlers } from '../register-ipc-handlers'

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
