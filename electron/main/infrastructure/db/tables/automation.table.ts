import { sql } from 'drizzle-orm'
import { int } from 'drizzle-orm/sqlite-core'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const rulesTable = sqliteTable('rules', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  target: text().notNull(),
  trigger: text().notNull(),
  priority: int().notNull(),
  enabled: int({ mode: 'boolean' }).notNull(),

  source: text().notNull(),
  ast: text().notNull(),

  createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  lastUpdated: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
})

export const templatesTable = sqliteTable('template', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),

  source: text().notNull(),
  ast: text().notNull(),

  createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  lastUpdated: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
})
