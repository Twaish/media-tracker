import { AiSettings } from '@/application/ai/AiSettings'

export type AiStatusSuccess = {
  available: true
  version: string
  models: string[]
}

export type AiStatusFailure = {
  available: false
  error: string
}

export type AiStatus = AiStatusFailure | AiStatusSuccess

export interface AiContext {
  checkCompatibility: () => Promise<AiStatus>
  updateHost: (host: string) => Promise<void>
  getSettings: () => Promise<AiSettings>
  createEmbedding: (text: string, model?: string) => Promise<number[]>
}
