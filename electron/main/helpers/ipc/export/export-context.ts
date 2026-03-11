import { ExportContext } from '@shared/types/export'
import { EXPORT_LIBRARY } from './export-channels'

export function exposeExportContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('export', {
    exportLibrary: (path) => ipcRenderer.invoke(EXPORT_LIBRARY, path),
  } satisfies ExportContext)
}
