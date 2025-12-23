import { BrowserWindow } from 'electron'
import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'
import { addNotesEventListeners } from './notes/notes-listeners'
import { LibSQLDatabase } from 'drizzle-orm/libsql'

export default function registerListeners(
  mainWindow: BrowserWindow,
  db: LibSQLDatabase,
) {
  addWindowEventListeners(mainWindow)
  addThemeEventListeners()
  addNotesEventListeners(db)
}
