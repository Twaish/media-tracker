import { int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core'
import { mediaTable } from './tables/media.table'
import { genresTable } from './tables/genres.table'

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
