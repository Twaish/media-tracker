import { sql } from 'drizzle-orm'
import { int, sqliteTable } from 'drizzle-orm/sqlite-core'
import { mediaTable } from './media.table'
import { index } from 'drizzle-orm/sqlite-core'

export const mediaProgressTable = sqliteTable(
  'media_progress',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    mediaId: int('media_id')
      .notNull()
      .references(() => mediaTable.id, { onDelete: 'cascade' }),
    progress: int('progress').notNull(),
    previousProgress: int('previous_progress'),
    createdAt: int({ mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('idx_media_progress_history').on(table.mediaId),
    index('idx_media_progress_time').on(table.mediaId, table.createdAt),
  ],
)
