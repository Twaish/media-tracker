import { sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const deltasTable = sqliteTable('deltas', {
  id: int().primaryKey({ autoIncrement: true }),
  entity: text('entity').notNull(),
  entityId: int('entity_id').notNull(),
  type: text('type', { enum: ['add', 'remove', 'update'] }).notNull(),
  before: text('before'),
  after: text('after'),
  createdAt: int('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
})
