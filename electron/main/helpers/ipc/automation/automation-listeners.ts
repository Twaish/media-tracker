import { createAutomationUseCases } from '@/usecases/automation'
import { Modules } from '../types'
import {
  RULE_ADD,
  RULE_GET_ENABLED,
  RULE_REMOVE,
  RULE_UPDATE,
  TEMPLATE_ADD,
  TEMPLATE_GET,
  TEMPLATE_REMOVE,
  TEMPLATE_UPDATE,
} from './automation-channels'
import {
  AddRuleDTO,
  AddTemplateDTO,
  UpdateRuleDTO,
  UpdateTemplateDTO,
} from '@shared/types/automation'
import { ipcMain } from 'electron'

export function addAutomationEventListeners(modules: Modules) {
  const useCases = createAutomationUseCases(modules)

  ipcMain.handle(RULE_ADD, (_, rule: AddRuleDTO) => {
    return useCases.addRule.execute(rule)
  })
  ipcMain.handle(RULE_UPDATE, (_, rule: UpdateRuleDTO) => {
    return useCases.updateRule.execute(rule)
  })
  ipcMain.handle(RULE_REMOVE, (_, ids: number[]) => {
    return useCases.removeRules.execute(ids)
  })
  ipcMain.handle(RULE_GET_ENABLED, () => {
    return useCases.getEnabledRules.execute()
  })

  ipcMain.handle(TEMPLATE_ADD, (_, template: AddTemplateDTO) => {
    return useCases.addTemplate.execute(template)
  })
  ipcMain.handle(TEMPLATE_UPDATE, (_, template: UpdateTemplateDTO) => {
    return useCases.updateTemplate.execute(template)
  })
  ipcMain.handle(TEMPLATE_REMOVE, (_, ids: number[]) => {
    return useCases.removeTemplates.execute(ids)
  })
  ipcMain.handle(TEMPLATE_GET, () => {
    return useCases.getAllTemplates.execute()
  })
}
