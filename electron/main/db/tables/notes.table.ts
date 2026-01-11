import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const notesTable = sqliteTable('notes_table', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  note: text().notNull(),
})
