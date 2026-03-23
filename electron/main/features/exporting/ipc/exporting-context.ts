import { ExportingContext } from '@shared/types'
import {
  EXPORTING_IMPORT_LIBRARY,
  EXPORTING_LIBRARY,
} from './exporting-channels'

export function exposeExportingContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('exporting', {
    exportLibrary: (path) => ipcRenderer.invoke(EXPORTING_LIBRARY, path),
    importLibrary: (path) => ipcRenderer.invoke(EXPORTING_IMPORT_LIBRARY, path),
  } satisfies ExportingContext)
}
