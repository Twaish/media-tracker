import { SearchContext } from '@shared/types/search'
import { SEARCH_RESOLVE_QUERY } from './search-channels'

export function exposeSearchContext() {
  const { contextBridge, ipcRenderer } = window.require('electron')
  const context: SearchContext = {
    resolveQuery(query: string) {
      return ipcRenderer.invoke(SEARCH_RESOLVE_QUERY, query)
    },
  }
  contextBridge.exposeInMainWorld('search', context)
}
