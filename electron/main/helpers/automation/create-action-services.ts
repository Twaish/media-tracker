import { RuleEngine } from '@/domain/automation/RuleEngine'
import { ActionServices } from '@/domain/automation/types'

export function createActionServices(ruleEngine: RuleEngine): ActionServices {
  return {
    callPlugin: async (name, args) => console.log(name, args),
    callTemplate: async (name, args: Record<string, unknown>): Promise<void> =>
      await ruleEngine.executeTemplate(name, args),
  }
}
