import { IPluginManager } from '@/app/plugins/application/ports/IPluginManager'
import { IRuleEngine } from '@/features/automation/application/interfaces/IRuleEngine'
import { RuleContext } from '@/features/automation/domain/runtime/RuleContext'
import { ActionServices } from '@/features/automation/domain/services/ActionServices'

export function createActionServices(
  ruleEngine: IRuleEngine,
  pluginManager: IPluginManager,
): ActionServices {
  return {
    callPlugin: async (name, ...args: unknown[]): Promise<void> => {
      await pluginManager.execute(name, ...args)
    },
    callTemplate: async (
      name,
      args: Record<string, unknown>,
      context: RuleContext<Record<string, unknown>>,
    ): Promise<void> => await ruleEngine.executeTemplate(name, args, context),
  }
}
