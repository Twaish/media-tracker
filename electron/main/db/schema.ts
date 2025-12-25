import { sql } from 'drizzle-orm'
import {
  AnySQLiteColumn,
  int,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core'
export const notesTable = sqliteTable('notes_table', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  note: text().notNull(),
})

export const genresTable = sqliteTable('genres', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
})

export const mediaTable = sqliteTable('media', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  currentEpisode: int().notNull().default(0),
  maxEpisodes: int(),

  mediaType: text()
    .$type<'anime' | 'manga' | 'manhwa' | 'manhua'>()
    .notNull()
    .default('anime'),
  status: text()
    .$type<'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch'>()
    .notNull()
    .default('plan-to-watch'),

  externalLink: text().notNull().default('/'),
  alternateTitles: text().notNull().default(''),

  watchAfter: int().references((): AnySQLiteColumn => mediaTable.id),

  lastUpdated: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  createdAt: int({ mode: 'timestamp_ms' }).default(sql`(unixepoch() * 1000)`),
  isFavorite: int({ mode: 'boolean' }).notNull().default(false),
})

export const mediaGenresTable = sqliteTable(
  'media_genres',
  {
    mediaId: int('media_id')
      .notNull()
      .references(() => mediaTable.id, { onDelete: 'cascade' }),

    genreId: int('genre_id')
      .notNull()
      .references(() => genresTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.mediaId, table.genreId] })],
)

export const DEFAULT_GENRES = [
  'Action',
  'Adventure',
  'Comedy',
  'Drama',
  'Fantasy',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Thriller',
]
