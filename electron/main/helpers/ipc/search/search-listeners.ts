import { createSearchUseCases } from '@/usecases/search'
import { ipcMain } from 'electron'
import { SEARCH_RESOLVE_QUERY } from './search-channels'

export function addSearchEventListeners() {
  const useCases = createSearchUseCases()

  ipcMain.handle(SEARCH_RESOLVE_QUERY, (_, query: string) => {
    return useCases.resolveSearchQuery.execute(query)
  })
}
