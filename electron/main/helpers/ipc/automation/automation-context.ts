import { AutomationContext } from '@shared/types/automation'
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
  contextBridge.exposeInMainWorld('automation', {
    addRule: (rule) => ipcRenderer.invoke(RULE_ADD, rule),
    updateRule: (rule) => ipcRenderer.invoke(RULE_UPDATE, rule),
    removeRules: (ids) => ipcRenderer.invoke(RULE_REMOVE, ids),
    getEnabledRules: () => ipcRenderer.invoke(RULE_GET_ENABLED),
    addTemplate: (template) => ipcRenderer.invoke(TEMPLATE_ADD, template),
    updateTemplate: (template) => ipcRenderer.invoke(TEMPLATE_UPDATE, template),
    removeTemplates: (ids) => ipcRenderer.invoke(TEMPLATE_REMOVE, ids),
    getAllTemplates: () => ipcRenderer.invoke(TEMPLATE_GET),
  } satisfies AutomationContext)
}
