import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { mediaTable } from './media.table'
import { sql } from 'drizzle-orm'
import { uniqueIndex } from 'drizzle-orm/sqlite-core'
import { index } from 'drizzle-orm/sqlite-core'

export const mediaEmbeddingsTable = sqliteTable(
  'media_embeddings',
  {
    id: int().primaryKey({ autoIncrement: true }),

    mediaId: int()
      .notNull()
      .references(() => mediaTable.id, { onDelete: 'cascade' }),
    model: text().notNull(),
    embedding: text().notNull(),
    createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    uniqueIndex('idx_media_model_unique').on(table.mediaId, table.model),
    index('idx_media_embeddings_mediaId').on(table.mediaId),
    index('idx_media_embeddings_model').on(table.model),
  ],
)
