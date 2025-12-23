import { ipcMain } from 'electron'
import { NOTES_ADD, NOTES_GET, NOTES_REMOVE } from './notes-channels'
import { LibSQLDatabase } from 'drizzle-orm/libsql'
import { notesTable } from '@/db/schema'

export function addNotesEventListeners(db: LibSQLDatabase) {
  ipcMain.handle(NOTES_GET, async () => {
    console.log('GETTING NOTES')
    const notes = await db.select().from(notesTable)
    return notes
  })
  ipcMain.handle(NOTES_ADD, async (_, title: string, noteText: string) => {
    console.log('ADDING NOTE', title, noteText)
    const note: typeof notesTable.$inferInsert = {
      title: title,
      note: noteText,
    }
    await db.insert(notesTable).values(note)
  })
  ipcMain.handle(NOTES_REMOVE, () => {
    console.log('REMOVING NOTE')
  })
}
