import { NOTES_ADD, NOTES_GET, NOTES_REMOVE } from './notes-channels'

export function exposeNotesContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('notes', {
    get: () => ipcRenderer.invoke(NOTES_GET),
    add: (title: string, note: string) =>
      ipcRenderer.invoke(NOTES_ADD, title, note),
    remove: () => ipcRenderer.invoke(NOTES_REMOVE),
  })
}
