import { Modules } from '@/helpers/ipc/types'
import SyncRuleEngine from '@/features/automation/usecases/syncRuleEngine'

export async function registerAutomationSchemas(modules: Modules) {
  const { RuleRepository, TemplateRepository, RuleEngine } = modules
  const syncRuleEngine = new SyncRuleEngine(
    RuleRepository,
    TemplateRepository,
    RuleEngine,
  )
  await syncRuleEngine.execute()
}
