import { AiCompatibilityResultDTO } from '@/features/ai/application/dto/AiCompatibilityResult.dto'
import { AiSettings } from '@/features/ai/domain/models/AiSettings'

export interface AiContext {
  checkCompatibility(): Promise<AiCompatibilityResultDTO>
  updateHost(host: string): Promise<void>
  updateApiKey(key: string): Promise<void>
  getSettings(): Promise<AiSettings>
  createEmbedding(text: string, model?: string): Promise<number[]>
  getCapabilities(model: string): Promise<string[]>
}
