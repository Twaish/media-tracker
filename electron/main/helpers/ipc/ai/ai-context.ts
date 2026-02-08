import { AiContext } from '@shared/types/ai'
import { AI_CHECK_COMPATIBILITY } from './ai-channels'

export function exposeAiContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: AiContext = {
    checkCompatibility: () => ipcRenderer.invoke(AI_CHECK_COMPATIBILITY),
  }
  contextBridge.exposeInMainWorld('ai', context)
}
