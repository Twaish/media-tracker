import SyncRuleEngine from '@/usecases/automation/syncRuleEngine'
import { Modules } from '../ipc/types'

export async function registerAutomationSchemas(modules: Modules) {
  const { RuleRepository, TemplateRepository, RuleEngine } = modules
  const syncRuleEngine = new SyncRuleEngine(
    RuleRepository,
    TemplateRepository,
    RuleEngine,
  )
  await syncRuleEngine.execute()
}
