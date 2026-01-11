import { notesTable } from '@/db/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Note = InferSelectModel<typeof notesTable>
export type NoteCreateInput = InferInsertModel<typeof notesTable>

export interface NotesContext {
  get: () => Promise<Note[]>
  add: (title: string, note: string) => Promise<Note>
  remove: () => Promise<void>
  image: (imagePath: string) => Promise<string>
}
