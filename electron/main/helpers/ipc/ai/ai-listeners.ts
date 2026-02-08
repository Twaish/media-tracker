import { ipcMain } from 'electron'
import { createAiUseCases } from '@/usecases/ai'
import { AI_CHECK_COMPATIBILITY } from './ai-channels'
import { Modules } from '../types'

export function addAiEventListeners(modules: Modules) {
  const useCases = createAiUseCases(modules)

  ipcMain.handle(AI_CHECK_COMPATIBILITY, () => {
    return useCases.checkAiCompatibility.execute()
  })
}
