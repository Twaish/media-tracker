import { sql } from 'drizzle-orm'
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { mediaTable } from './media.table'

export const watchPlansTable = sqliteTable('watch_plans', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
})

export const watchPlanSegmentsTable = sqliteTable('watch_plan_segments', {
  id: int().primaryKey({ autoIncrement: true }),

  watchPlanId: int()
    .notNull()
    .references(() => watchPlansTable.id, { onDelete: 'cascade' }),

  mediaId: int()
    .notNull()
    .references(() => mediaTable.id, { onDelete: 'cascade' }),

  startEpisode: int().notNull(),
  endEpisode: int().notNull(),
  order: int().notNull(),
})
