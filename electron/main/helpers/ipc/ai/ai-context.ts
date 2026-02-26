import { AiContext } from '@shared/types/ai'
import {
  AI_CHECK_COMPATIBILITY,
  AI_CREATE_EMBEDDING,
  AI_GET_CAPABILITIES,
  AI_GET_SETTINGS,
  AI_UPDATE_HOST,
} from './ai-channels'

export function exposeAiContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: AiContext = {
    checkCompatibility() {
      return ipcRenderer.invoke(AI_CHECK_COMPATIBILITY)
    },
    updateHost(host: string) {
      return ipcRenderer.invoke(AI_UPDATE_HOST, host)
    },
    getSettings() {
      return ipcRenderer.invoke(AI_GET_SETTINGS)
    },
    createEmbedding(text: string, model?: string) {
      return ipcRenderer.invoke(AI_CREATE_EMBEDDING, text, model)
    },
    getCapabilities(model: string) {
      return ipcRenderer.invoke(AI_GET_CAPABILITIES, model)
    },
  }
  contextBridge.exposeInMainWorld('ai', context)
}
