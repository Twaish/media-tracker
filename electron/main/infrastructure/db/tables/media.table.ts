import { MediaStatus, MediaType } from '@/domain/entities/media'
import { sql } from 'drizzle-orm'
import { index } from 'drizzle-orm/sqlite-core'
import {
  AnySQLiteColumn,
  int,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'

export const mediaTable = sqliteTable(
  'media',
  {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    currentEpisode: int().notNull().default(0),
    maxEpisodes: int(),
    thumbnail: text(),

    type: text().$type<MediaType>().notNull().default('anime'),
    status: text().$type<MediaStatus>().notNull().default('plan-to-watch'),

    externalLink: text(),
    alternateTitles: text(),

    watchAfter: int().references((): AnySQLiteColumn => mediaTable.id),

    lastUpdated: int({ mode: 'timestamp_ms' }).default(
      sql`(unixepoch() * 1000)`,
    ),
    createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
    isFavorite: int({ mode: 'boolean' }).notNull().default(false),

    deletedAt: int({ mode: 'timestamp_ms' }),
  },
  (table) => [
    index('idx_media_external_link').on(table.externalLink),
    index('idx_media_thumbnail').on(table.thumbnail),
    index('idx_media_title').on(table.title),
    index('idx_media_watch_after').on(table.watchAfter),
  ],
)
