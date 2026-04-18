import { ipc } from '@/ipc'

export async function checkAiCompatibility() {
  return ipc.client.ai.checkCompatibility()
}

export async function updateAiHost(host: string) {
  return ipc.client.ai.updateHost(host)
}

export async function updateAiApiKey(apiKey: string) {
  return ipc.client.ai.updateApiKey(apiKey)
}

export async function getAiSettings() {
  return ipc.client.ai.getSettings()
}

export async function createEmbedding(text: string, model: string) {
  return ipc.client.ai.createEmbedding({ text, model })
}

export async function getModelCapabilities(model: string) {
  return ipc.client.ai.getCapabilities(model)
}
