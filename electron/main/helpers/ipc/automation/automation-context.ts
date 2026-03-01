import {
  AddRuleDTO,
  AddTemplateDTO,
  AutomationContext,
  UpdateRuleDTO,
  UpdateTemplateDTO,
} from '@shared/types/automation'
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

export function exposeAutomationContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: AutomationContext = {
    addRule(rule: AddRuleDTO) {
      return ipcRenderer.invoke(RULE_ADD, rule)
    },
    updateRule(rule: UpdateRuleDTO) {
      return ipcRenderer.invoke(RULE_UPDATE, rule)
    },
    removeRules(ids: number[]) {
      return ipcRenderer.invoke(RULE_REMOVE, ids)
    },
    getEnabledRules() {
      return ipcRenderer.invoke(RULE_GET_ENABLED)
    },

    addTemplate(template: AddTemplateDTO) {
      return ipcRenderer.invoke(TEMPLATE_ADD, template)
    },
    updateTemplate(template: UpdateTemplateDTO) {
      return ipcRenderer.invoke(TEMPLATE_UPDATE, template)
    },
    removeTemplates(ids: number[]) {
      return ipcRenderer.invoke(TEMPLATE_REMOVE, ids)
    },
    getAllTemplates() {
      return ipcRenderer.invoke(TEMPLATE_GET)
    },
  }
  contextBridge.exposeInMainWorld('automation', context)
}
