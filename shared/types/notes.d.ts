import { notesTable } from '@/db/schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export type Note = InferSelectModel<typeof notesTable>
export type NoteCreateInput = InferInsertModel<typeof notesTable>

export interface NotesContext {
  getAll: () => Promise<Note[]>
  create: (note: NoteCreateInput) => Promise<void>
  image: (imagePath: string) => Promise<string>
}
