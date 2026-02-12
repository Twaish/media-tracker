import { ipcMain } from 'electron'
import { Modules } from '../types'
import { SEARCH_RESOLVE_QUERY } from './search-channels'
import { createSearchUseCases } from '@/usecases/search'

export function addSearchEventListeners(modules: Modules) {
  const useCases = createSearchUseCases(modules)

  ipcMain.handle(SEARCH_RESOLVE_QUERY, (_, query: string) => {
    return useCases.resolveSearchQuery.execute(query)
  })
}
