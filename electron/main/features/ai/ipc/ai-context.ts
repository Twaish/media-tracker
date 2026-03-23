import { AiContext } from '@shared/types'
import {
  AI_CHECK_COMPATIBILITY,
  AI_CREATE_EMBEDDING,
  AI_GET_CAPABILITIES,
  AI_GET_SETTINGS,
  AI_UPDATE_HOST,
  AI_UPDATE_API_KEY,
} from './ai-channels'

export function exposeAiContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('ai', {
    checkCompatibility: () => ipcRenderer.invoke(AI_CHECK_COMPATIBILITY),
    updateHost: (host) => ipcRenderer.invoke(AI_UPDATE_HOST, host),
    updateApiKey: (key) => ipcRenderer.invoke(AI_UPDATE_API_KEY, key),
    getSettings: () => ipcRenderer.invoke(AI_GET_SETTINGS),
    createEmbedding: (text, model?) =>
      ipcRenderer.invoke(AI_CREATE_EMBEDDING, text, model),
    getCapabilities: (model) => ipcRenderer.invoke(AI_GET_CAPABILITIES, model),
  } satisfies AiContext)
}
