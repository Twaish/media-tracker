import { ipc } from '@/ipc'
import { AddNodeDTO, UpdateNodeDTO } from '@shared/types'

export async function syncEngine() {
  return ipc.client.automation.syncEngine()
}

export async function addRule(rule: AddNodeDTO) {
  return ipc.client.automation.addRule(rule)
}
export async function updateRule(rule: UpdateNodeDTO) {
  return ipc.client.automation.updateRule(rule)
}
export async function removeRules(ids: number[]) {
  return ipc.client.automation.removeRules(ids)
}
export async function getEnabledRules() {
  return ipc.client.automation.getEnabledRules()
}
export async function getAllRules() {
  return ipc.client.automation.getAllRules()
}

export async function addTemplate(source: string) {
  return ipc.client.automation.addTemplate({ source })
}
export async function updateTemplate(template: { id: number; source: string }) {
  return ipc.client.automation.updateTemplate(template)
}
export async function removeTemplates(ids: number[]) {
  return ipc.client.automation.removeTemplates(ids)
}
export async function getAllTemplates() {
  return ipc.client.automation.getAllTemplates()
}
