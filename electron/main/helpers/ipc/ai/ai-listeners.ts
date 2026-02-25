import { ipcMain } from 'electron'
import { createAiUseCases } from '@/usecases/ai'
import {
  AI_CHECK_COMPATIBILITY,
  AI_CREATE_EMBEDDING,
  AI_GET_SETTINGS,
  AI_UPDATE_HOST,
} from './ai-channels'
import { Modules } from '../types'

export function addAiEventListeners(modules: Modules) {
  const useCases = createAiUseCases(modules)

  ipcMain.handle(AI_CHECK_COMPATIBILITY, () => {
    return useCases.checkAiCompatibility.execute()
  })
  ipcMain.handle(AI_UPDATE_HOST, (_, host: string) => {
    return useCases.updateAiHost.execute(host)
  })
  ipcMain.handle(AI_GET_SETTINGS, () => {
    return useCases.getAiSettings.execute()
  })
  ipcMain.handle(AI_CREATE_EMBEDDING, (_, text: string, model?: string) => {
    return useCases.createAiTextEmbedding.execute(text, model)
  })
}
