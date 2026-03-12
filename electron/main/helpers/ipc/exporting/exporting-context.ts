import { ExportingContext } from '@shared/types/exporting'
import { EXPORTING_LIBRARY } from './exporting-channels'

export function exposeExportingContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('exporting', {
    exportLibrary: (path) => ipcRenderer.invoke(EXPORTING_LIBRARY, path),
  } satisfies ExportingContext)
}
