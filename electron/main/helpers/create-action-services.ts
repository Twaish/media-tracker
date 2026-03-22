import { IRuleEngine } from '@/features/automation/application/interfaces/IRuleEngine'
import { RuleContext } from '@/features/automation/domain/runtime/RuleContext'
import { ActionServices } from '@/features/automation/domain/services/ActionServices'

export function createActionServices(ruleEngine: IRuleEngine): ActionServices {
  return {
    callPlugin: async (name, args) => console.log(name, args),
    callTemplate: async (
      name,
      args: Record<string, unknown>,
      context: RuleContext<Record<string, unknown>>,
    ): Promise<void> => await ruleEngine.executeTemplate(name, args, context),
  }
}
