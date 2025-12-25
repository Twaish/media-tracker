import { ipcMain } from 'electron'
import {
  NOTES_ADD,
  NOTES_GET,
  NOTES_IMAGE,
  NOTES_REMOVE,
} from './notes-channels'
import { notesTable } from '@/db/schema'
import { Modules } from '../types'

export function addNotesEventListeners({ Database, StorageService }: Modules) {
  ipcMain.handle(NOTES_GET, async () => {
    console.log('GETTING NOTES')
    const notes = await Database.select().from(notesTable)
    return notes
  })
  ipcMain.handle(NOTES_ADD, async (_, title: string, noteText: string) => {
    console.log('ADDING NOTE', title, noteText)
    const note: typeof notesTable.$inferInsert = {
      title: title,
      note: noteText,
    }
    await Database.insert(notesTable).values(note)
  })
  ipcMain.handle(NOTES_REMOVE, () => {
    console.log('REMOVING NOTE')
  })
  ipcMain.handle(NOTES_IMAGE, (_, imagePath: string) => {
    return StorageService.storeImage(imagePath)
  })
}
