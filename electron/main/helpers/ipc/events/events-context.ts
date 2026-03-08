import { EventsContext } from '@shared/types'
import { EVENTS_GET } from './events-channels'

export function exposeEventsContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('events', {
    get: () => ipcRenderer.invoke(EVENTS_GET),
  } satisfies EventsContext)
}
