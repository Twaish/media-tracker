import { int, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { mediaTable } from './tables/media.table'

export const genresTable = sqliteTable('genres', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull().unique(),
  isDeletable: int({ mode: 'boolean' }).notNull().default(false),
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
