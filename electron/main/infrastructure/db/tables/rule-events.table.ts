import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { rulesTable } from './automation.table'

export const ruleEventsTable = sqliteTable('rule_events', {
  id: int().primaryKey({ autoIncrement: true }),
  ruleId: int()
    .notNull()
    .references(() => rulesTable.id, { onDelete: 'cascade' }),
  name: text().notNull(),
})
