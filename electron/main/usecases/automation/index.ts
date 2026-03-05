import { Modules } from '@/helpers/ipc/types'
import AddRule from './addRule'
import UpdateRule from './updateRule'
import RemoveRules from './removeRules'
import GetEnabledRules from './getEnabledRules'
import AddTemplate from './addTemplate'
import UpdateTemplate from './updateTemplate'
import RemoveTemplates from './removeTemplates'
import GetAllTemplates from './getAllTemplates'

export function createAutomationUseCases({
  RuleRepository,
  RuleEngineCompiler,
  TemplateRepository,
}: Modules) {
  return {
    addRule: new AddRule(RuleRepository, RuleEngineCompiler),
    updateRule: new UpdateRule(RuleRepository, RuleEngineCompiler),
    removeRules: new RemoveRules(RuleRepository),
    getEnabledRules: new GetEnabledRules(RuleRepository),

    addTemplate: new AddTemplate(TemplateRepository, RuleEngineCompiler),
    updateTemplate: new UpdateTemplate(TemplateRepository, RuleEngineCompiler),
    removeTemplates: new RemoveTemplates(TemplateRepository),
    getAllTemplates: new GetAllTemplates(TemplateRepository),
  }
}
