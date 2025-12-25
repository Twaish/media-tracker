import { ipcMain } from 'electron'
import { GENRES_GET } from './genres-channels'
import { Modules } from '../types'
import { genresTable } from '@/db/schema'

export function addGenresEventListeners({ Database }: Modules) {
  ipcMain.handle(GENRES_GET, async () => {
    console.log('GETTING GENRES')
    const genres = await Database.select().from(genresTable)
    return genres
  })
}
