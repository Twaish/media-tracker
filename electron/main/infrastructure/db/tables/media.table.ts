import { MediaStatus, MediaType } from '@/domain/entities/media'
import { sql } from 'drizzle-orm'
import {
  AnySQLiteColumn,
  int,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'

export const mediaTable = sqliteTable('media', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  currentEpisode: int().notNull().default(0),
  maxEpisodes: int(),
  thumbnail: text(),

  mediaType: text().$type<MediaType>().notNull().default('anime'),
  status: text().$type<MediaStatus>().notNull().default('plan-to-watch'),

  externalLink: text().notNull().default('/'),
  alternateTitles: text().notNull().default(''),

  watchAfter: int().references((): AnySQLiteColumn => mediaTable.id),

  lastUpdated: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  isFavorite: int({ mode: 'boolean' }).notNull().default(false),
})
